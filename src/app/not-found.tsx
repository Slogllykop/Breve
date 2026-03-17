import { IconFileUnknown } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page or link you requested could not be found.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function NotFound() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-black text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
                <IconFileUnknown className="h-10 w-10 text-zinc-400" />
            </div>
            <div className="space-y-2">
                <h2 className="font-bold text-3xl text-white tracking-tight">
                    Page Not Found
                </h2>
                <p className="mx-auto max-w-md text-lg text-zinc-500">
                    We couldn't find the page or link you were looking for.
                </p>
            </div>
            <div className="mt-4 flex gap-4">
                <Button
                    variant="default"
                    nativeButton={false}
                    render={<Link href="/">Return to Dashboard</Link>}
                />
            </div>
        </div>
    );
}
