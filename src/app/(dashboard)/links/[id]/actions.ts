"use server";

import { createClient } from "@/lib/supabase/server";

export type TimeSeriesData = {
    date: string;
    clicks: number;
};

export type DeviceData = {
    device_type: string;
    clicks: number;
};

export type CountryData = {
    country: string;
    clicks: number;
};

export type LinkAnalytics = {
    timeSeries: TimeSeriesData[];
    devices: DeviceData[];
    countries: CountryData[];
};

function toSafeNumber(value: unknown) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : 0;
}

function toDateKey(value: unknown) {
    if (typeof value !== "string" || !value.trim()) {
        return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed.toISOString().slice(0, 10);
}

export async function getLinkAnalytics(
    linkId: number,
    period: "7d" | "30d" | "90d" | "all" = "30d",
): Promise<LinkAnalytics> {
    const supabase = await createClient();

    const [timeResponse, deviceResponse, countryResponse] = await Promise.all([
        supabase.rpc("get_link_analytics", {
            p_link_id: linkId,
            p_period: period,
        }),
        supabase.rpc("get_device_analytics", {
            p_link_id: linkId,
        }),
        supabase.rpc("get_country_analytics", {
            p_link_id: linkId,
        }),
    ]);

    const timeSeriesMap = new Map<string, number>();
    for (const row of (timeResponse.data ?? []) as {
        date?: unknown;
        click_count?: unknown;
    }[]) {
        const key = toDateKey(row.date);
        if (!key) continue;
        timeSeriesMap.set(
            key,
            (timeSeriesMap.get(key) ?? 0) + toSafeNumber(row.click_count),
        );
    }

    const deviceMap = new Map<string, number>();
    for (const row of (deviceResponse.data ?? []) as {
        device_type?: unknown;
        click_count?: unknown;
    }[]) {
        const key =
            typeof row.device_type === "string" && row.device_type.trim()
                ? row.device_type.trim().toLowerCase()
                : "unknown";
        deviceMap.set(
            key,
            (deviceMap.get(key) ?? 0) + toSafeNumber(row.click_count),
        );
    }

    const countryMap = new Map<string, number>();
    for (const row of (countryResponse.data ?? []) as {
        country?: unknown;
        click_count?: unknown;
    }[]) {
        const key =
            typeof row.country === "string" && row.country.trim()
                ? row.country.trim()
                : "unknown";
        countryMap.set(
            key,
            (countryMap.get(key) ?? 0) + toSafeNumber(row.click_count),
        );
    }

    return {
        timeSeries: Array.from(timeSeriesMap.entries())
            .map(([date, clicks]) => ({ date, clicks }))
            .sort((a, b) => a.date.localeCompare(b.date)),
        devices: Array.from(deviceMap.entries())
            .map(([device_type, clicks]) => ({ device_type, clicks }))
            .sort((a, b) => b.clicks - a.clicks),
        countries: Array.from(countryMap.entries())
            .map(([country, clicks]) => ({ country, clicks }))
            .sort((a, b) => b.clicks - a.clicks),
    };
}
