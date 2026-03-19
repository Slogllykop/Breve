"use client";

import { Pie, PieChart, Sector } from "recharts";
import type { DeviceData } from "@/app/(dashboard)/links/[id]/actions";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = {
    desktop: "#10b981", // Emerald
    mobile: "#f59e0b", // Amber
    tablet: "#8b5cf6", // Violet
    unknown: "#f43f5e", // Rose
};

export function DeviceChart({ data }: { data: DeviceData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground text-sm">
                No device data available.
            </div>
        );
    }

    const chartData = data.map((item) => ({
        name: item.device_type,
        value: item.clicks,
        fill: COLORS[item.device_type as keyof typeof COLORS] || COLORS.unknown,
    }));

    return (
        <ChartContainer
            config={{
                desktop: { label: "Desktop", color: COLORS.desktop },
                mobile: { label: "Mobile", color: COLORS.mobile },
                tablet: { label: "Tablet", color: COLORS.tablet },
                unknown: { label: "Unknown", color: COLORS.unknown },
            }}
            className="aspect-auto h-[300px] w-full"
        >
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            hideLabel
                            formatter={(value: number, name: string) => (
                                <>
                                    <span className="text-muted-foreground capitalize">
                                        {String(name)}
                                    </span>
                                    <span className="font-medium font-mono text-foreground">
                                        {Number(value).toLocaleString()}
                                    </span>
                                </>
                            )}
                        />
                    }
                />
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                    // biome-ignore lint/suspicious/noExplicitAny: Recharts custom shape props receive dynamic SVG attributes.
                    shape={(props: any) => {
                        const { payload, ...rest } = props;
                        return <Sector {...rest} fill={payload.fill} />;
                    }}
                />
                <ChartLegend
                    verticalAlign="bottom"
                    content={<ChartLegendContent nameKey="name" />}
                />
            </PieChart>
        </ChartContainer>
    );
}
