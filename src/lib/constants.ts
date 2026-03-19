/**
 * Shared constants across the Breve application.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL as string;

export const ANALYTICS_PERIODS = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "all", label: "All" },
] as const;

export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number]["value"];

export const CHART_COLORS = {
    clicks: "#10b981", // Emerald 500
    locations: "#10b981", // Emerald 500
    devices: [
        "#10b981", // Emerald 500
        "#3b82f6", // Blue 500
        "#f59e0b", // Amber 500
        "#8b5cf6", // Violet 500
        "#ec4899", // Pink 500
        "#06b6d4", // Cyan 500
    ],
} as const;

export const CACHE_TTL = {
    ANALYTICS: 60, // 60 seconds
} as const;
