"use server";

import { cacheLink, getCachedLink } from "@/lib/redis/cache";
import { createClient } from "@/lib/supabase/server";

export async function getLinkBySlug(slug: string) {
    try {
        // 1. Try Redis cache first
        let cachedLink = await getCachedLink(slug);

        // 2. Cache miss → query Supabase RPC
        if (!cachedLink) {
            const supabase = await createClient();
            const { data, error } = await supabase.rpc("get_link_by_slug", {
                p_slug: slug,
            });

            if (error || !data || data.length === 0) {
                return { error: "Link not found" };
            }

            const link = data[0];
            cachedLink = {
                original_url: link.original_url,
                link_id: link.id,
            };

            // Fill Redis cache for next time
            await cacheLink(slug, link.original_url, link.id);
        }

        return { data: cachedLink };
    } catch (e) {
        console.error("Error retrieving link:", e);
        return { error: "Internal server error" };
    }
}
