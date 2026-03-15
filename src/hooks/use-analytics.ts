"use client";

import { useEffect, useState, useTransition } from "react";
import type { LinkAnalytics } from "@/app/(dashboard)/links/[id]/actions";
import { getLinkAnalytics } from "@/app/(dashboard)/links/[id]/actions";

export type Period = "7d" | "30d" | "90d" | "all";

export function useAnalytics(linkId: number) {
    const [period, setPeriod] = useState<Period>("30d");
    const [data, setData] = useState<LinkAnalytics | null>(null);
    const [isLoading, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        startTransition(async () => {
            try {
                setError(null);
                const result = await getLinkAnalytics(linkId, period);
                if (isMounted) setData(result);
            } catch (_err) {
                if (isMounted) setError("Failed to fetch analytics");
            }
        });

        return () => {
            isMounted = false;
        };
    }, [linkId, period]);

    return {
        data,
        period,
        setPeriod,
        isLoading,
        error,
    };
}
