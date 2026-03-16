"use client";

import { Cell, Pie, PieChart } from "recharts";
import type { DeviceData } from "@/app/(dashboard)/links/[id]/actions";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = {
    desktop: "rgba(255,255,255,0.92)",
    mobile: "rgba(255,255,255,0.72)",
    tablet: "rgba(255,255,255,0.54)",
    unknown: "rgba(255,255,255,0.3)",
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
                >
                    {chartData.map((entry, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: Static legend order is acceptable here.
                        <Cell key={`device-slice-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend
                    verticalAlign="bottom"
                    content={<ChartLegendContent nameKey="name" />}
                />
            </PieChart>
        </ChartContainer>
    );
}
