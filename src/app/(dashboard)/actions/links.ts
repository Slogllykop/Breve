"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { cacheLink, invalidateLink } from "@/lib/redis/cache";
import { createClient } from "@/lib/supabase/server";

const createLinkSchema = z.object({
    slug: z.string().min(1, "Slug is required").max(100, "Slug is too long"),
    originalUrl: z.url("Invalid original URL"),
    title: z.string().nullable(),
});

const updateLinkSchema = z.object({
    id: z.number().positive("Invalid link ID"),
    slug: z.string().min(1, "Slug is required").max(100, "Slug is too long"),
    originalUrl: z.url("Invalid original URL"),
    title: z.string().nullable(),
    oldSlug: z.string().min(1, "Old slug is required"),
});

const deleteLinkSchema = z.object({
    id: z.number().positive("Invalid link ID"),
    slug: z.string().min(1, "Slug is required"),
});

export type LinkData = {
    id: number;
    slug: string;
    original_url: string;
    title: string | null;
    created_at: string;
    updated_at: string;
    click_count: number;
};

export type LinkResult = {
    success: boolean;
    error?: string;
    data?: LinkData;
};

/** Fetches all links for the authenticated user via Supabase RPC. */
export async function getLinks(): Promise<LinkData[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_all_links");

    if (error) {
        console.error("Failed to fetch links:", error.message);
        return [];
    }

    return (data ?? []) as LinkData[];
}

/** Creates a new short link and caches it in Redis. */
export async function createLink(
    slug: string,
    originalUrl: string,
    title: string | null,
): Promise<LinkResult> {
    const parsed = createLinkSchema.safeParse({ slug, originalUrl, title });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }
    const validData = parsed.data;

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_link", {
        p_slug: validData.slug,
        p_original_url: validData.originalUrl,
        p_title: validData.title,
    });

    if (error) {
        if (
            error.message.includes("unique") ||
            error.message.includes("duplicate")
        ) {
            return { success: false, error: "This slug is already taken." };
        }
        return { success: false, error: error.message };
    }

    const link = data?.[0];
    if (link) {
        await cacheLink(validData.slug, validData.originalUrl, link.id);
    }

    revalidatePath("/");
    return { success: true };
}

/** Updates an existing link's slug, URL, and title. Manages Redis cache invalidation. */
export async function updateLink(
    id: number,
    slug: string,
    originalUrl: string,
    title: string | null,
    oldSlug: string,
): Promise<LinkResult> {
    const parsed = updateLinkSchema.safeParse({
        id,
        slug,
        originalUrl,
        title,
        oldSlug,
    });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }
    const validData = parsed.data;

    const supabase = await createClient();

    // Invalidate old slug from cache if slug changed
    if (validData.oldSlug !== validData.slug) {
        await invalidateLink(validData.oldSlug);
    }

    const { error } = await supabase.rpc("update_link", {
        p_id: validData.id,
        p_slug: validData.slug,
        p_original_url: validData.originalUrl,
        p_title: validData.title,
    });

    if (error) {
        if (
            error.message.includes("unique") ||
            error.message.includes("duplicate")
        ) {
            return { success: false, error: "This slug is already taken." };
        }
        return { success: false, error: error.message };
    }

    // Update cache with new slug
    await cacheLink(validData.slug, validData.originalUrl, validData.id);

    revalidatePath("/");
    return { success: true };
}

/** Deletes a link and invalidates its Redis cache entry. */
export async function deleteLink(
    id: number,
    slug: string,
): Promise<LinkResult> {
    const parsed = deleteLinkSchema.safeParse({ id, slug });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }
    const validData = parsed.data;

    const supabase = await createClient();

    await invalidateLink(validData.slug);

    const { error } = await supabase.rpc("delete_link", { p_id: validData.id });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true };
}
