import { after, type NextRequest, NextResponse } from "next/server";
import {
    cacheLink,
    getCachedLink,
    incrementClickCount,
} from "@/lib/redis/cache";
import { createClient } from "@/lib/supabase/server";

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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;

    // 1. Try Redis cache first
    let cachedLink = await getCachedLink(slug);

    // 2. Cache miss → query Supabase RPC
    if (!cachedLink) {
        const supabase = await createClient();
        const { data, error } = await supabase.rpc("get_link_by_slug", {
            p_slug: slug,
        });

        if (error || !data || data.length === 0) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 },
            );
        }

        const link = data[0];
        cachedLink = {
            original_url: link.original_url,
            link_id: link.id,
        };

        // Fill Redis cache for next time
        await cacheLink(slug, link.original_url, link.id);
    }

    // 3. Record click asynchronously (non-blocking)
    const userAgent = request.headers.get("user-agent");
    const country = request.headers.get("x-vercel-ip-country") ?? "unknown";
    const referrer = request.headers.get("referer") ?? null;
    const deviceType = detectDevice(userAgent);

    after(async () => {
        // Increment Redis counter
        await incrementClickCount(cachedLink.link_id);

        // Record in Supabase
        const supabase = await createClient();
        await supabase.rpc("record_click", {
            p_link_id: cachedLink.link_id,
            p_device_type: deviceType,
            p_country: country,
            p_referrer: referrer,
        });
    });

    // 4. Redirect instantly
    return NextResponse.redirect(cachedLink.original_url, 307);
}
