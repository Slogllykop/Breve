"use client";

import { useEffect, useState } from "react";
import { getLinkBySlug } from "@/app/[slug]/actions";

type RedirectClientProps = {
    slug: string;
};

function detectDevice(userAgent: string | null): string {
    if (!userAgent) return "unknown";
    const ua = userAgent.toLowerCase();
    if (
        ua.includes("mobile") ||
        ua.includes("android") ||
        ua.includes("iphone") ||
        ua.includes("ipad")
    ) {
        return "mobile";
    }
    return "desktop";
}

export function RedirectClient({ slug }: RedirectClientProps) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function processRedirect() {
            try {
                // Parallel data fetching: URL resolution from DB/Redis AND User location from ipapi
                const [linkResult, geoResult] = await Promise.allSettled([
                    getLinkBySlug(slug),
                    fetch("https://ipapi.co/json/").then((res) => {
                        if (!res.ok) throw new Error("Geo fetch failed");
                        return res.json();
                    }),
                ]);

                if (!isMounted) return;

                // Handle Link Resolution
                let linkId = null;
                let originalUrl = null;

                if (linkResult.status === "fulfilled") {
                    if (linkResult.value.error) {
                        setError(linkResult.value.error);
                        return;
                    }
                    if (linkResult.value.data) {
                        linkId = linkResult.value.data.link_id;
                        originalUrl = linkResult.value.data.original_url;
                    }
                } else {
                    setError("Failed to resolve link");
                    return;
                }

                if (!linkId || !originalUrl) {
                    setError("Link not found");
                    return;
                }

                // Handle Geo Resolution
                let country = "unknown";
                if (geoResult.status === "fulfilled" && geoResult.value) {
                    country =
                        geoResult.value.country_name ||
                        geoResult.value.country ||
                        "unknown";
                }

                // Detect Device Type Client-Side
                const userAgent = navigator.userAgent;
                const deviceType = detectDevice(userAgent);
                const referrer = document.referrer || "";

                // Send Analytics
                try {
                    await fetch("/api/track", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            link_id: linkId,
                            country: country,
                            deviceType: deviceType,
                            referrer: referrer,
                        }),
                    });
                } catch (trackErr) {
                    console.error("Failed to track analytics:", trackErr);
                }

                // Finally redirect
                window.location.replace(originalUrl);
            } catch (err) {
                console.error("Redirect processing error:", err);
                if (isMounted) {
                    setError("An unexpected error occurred");
                }
            }
        }

        processRedirect();

        return () => {
            isMounted = false;
        };
    }, [slug]);

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-red-500/10 p-4">
                    <svg
                        className="h-8 w-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="font-semibold text-white text-xl">
                        Redirect stuck
                    </h2>
                    <p className="mt-2 text-white/70">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10" />
                <div className="absolute top-0 right-0 bottom-0 left-0 animate-spin rounded-full border-white border-t-4 border-l-4" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <h2 className="font-semibold text-white text-xl">
                    Taking you there
                </h2>
                <p className="text-sm text-white/60">
                    Just a moment, preparing your destination...
                </p>
            </div>
        </div>
    );
}
