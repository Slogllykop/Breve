"use client";

import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                <IconAlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <div className="space-y-2">
                <h2 className="font-bold text-2xl text-white tracking-tight">
                    Something went wrong!
                </h2>
                <p className="mx-auto max-w-md text-zinc-500">
                    We encountered an unexpected error while loading this page.
                    Our team has been notified.
                </p>
            </div>
            <Button onClick={() => reset()} variant="secondary">
                Try again
            </Button>
        </div>
    );
}
