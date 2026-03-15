"use client";

import { Cell, Legend, Pie, PieChart } from "recharts";
import type { DeviceData } from "@/app/(dashboard)/links/[id]/actions";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = {
    desktop: "hsl(var(--chart-1))",
    mobile: "hsl(var(--chart-2))",
    unknown: "hsl(var(--chart-3))",
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
                unknown: { label: "Unknown", color: COLORS.unknown },
            }}
            className="h-[300px] w-full"
        >
            <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                >
                    {chartData.map((entry, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: Safe to use index here as data is static
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
        </ChartContainer>
    );
}
