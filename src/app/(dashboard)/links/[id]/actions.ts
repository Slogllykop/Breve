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

export async function getLinkAnalytics(
    linkId: number,
    period: "7d" | "30d" | "90d" | "all" = "30d",
): Promise<LinkAnalytics> {
    const supabase = await createClient();

    // Fetch all analytics in parallel
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

    return {
        timeSeries: (timeResponse.data ?? []) as TimeSeriesData[],
        devices: (deviceResponse.data ?? []) as DeviceData[],
        countries: (countryResponse.data ?? []) as CountryData[],
    };
}
