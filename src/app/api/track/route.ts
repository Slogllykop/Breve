// unused import removed
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { incrementClickCount } from "@/lib/redis/cache";

function createRouteSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            "Missing Supabase environment variables for route analytics",
        );
    }

    return createSupabaseClient(supabaseUrl, supabaseKey);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { link_id, country, deviceType, referrer } = body;

        if (!link_id) {
            return NextResponse.json(
                { error: "Missing link_id" },
                { status: 400 },
            );
        }

        const results = await Promise.allSettled([
            incrementClickCount(link_id),
            createRouteSupabaseClient().rpc("record_click", {
                p_link_id: link_id,
                p_device_type: deviceType || "unknown",
                p_country: country || "unknown",
                p_referrer: referrer || null,
            }),
        ]);

        const [, recordClickResult] = results;

        if (
            recordClickResult.status === "fulfilled" &&
            recordClickResult.value.error
        ) {
            console.error(
                "Failed to record click analytics:",
                recordClickResult.value.error.message,
            );
            return NextResponse.json(
                { error: "Failed to record analytics" },
                { status: 500 },
            );
        }

        for (const result of results) {
            if (result.status === "rejected") {
                console.error(
                    "Failed background redirect task:",
                    result.reason,
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Tracking API Error:", e);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
