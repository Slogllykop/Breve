"use server";

import { revalidatePath } from "next/cache";
import { cacheLink, invalidateLink } from "@/lib/redis/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
    success: boolean;
    error?: string;
};

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

// ---- Auth Actions ----

export async function sendOtp(
    email: string,
    origin: string,
): Promise<AuthResult> {
    const supabase = await createClient();

    // Check if the email is whitelisted before sending OTP
    const { data: isWhitelisted, error: checkError } = await supabase.rpc(
        "check_email_whitelisted",
        { p_email: email },
    );

    if (checkError) {
        return {
            success: false,
            error: "Unable to verify email. Please try again.",
        };
    }

    if (!isWhitelisted) {
        return {
            success: false,
            error: "This email is not authorized.",
        };
    }

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: `${origin}/auth/confirm`,
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
}

// ---- Link CRUD Actions ----

export async function getLinks(): Promise<LinkData[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_all_links");

    if (error) {
        console.error("Failed to fetch links:", error.message);
        return [];
    }

    return (data ?? []) as LinkData[];
}

export async function createLink(
    slug: string,
    originalUrl: string,
    title: string | null,
): Promise<LinkResult> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_link", {
        p_slug: slug,
        p_original_url: originalUrl,
        p_title: title,
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
        await cacheLink(slug, originalUrl, link.id);
    }

    revalidatePath("/");
    return { success: true };
}

export async function updateLink(
    id: number,
    slug: string,
    originalUrl: string,
    title: string | null,
    oldSlug: string,
): Promise<LinkResult> {
    const supabase = await createClient();

    // Invalidate old slug from cache
    if (oldSlug !== slug) {
        await invalidateLink(oldSlug);
    }

    const { error } = await supabase.rpc("update_link", {
        p_id: id,
        p_slug: slug,
        p_original_url: originalUrl,
        p_title: title,
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
    await cacheLink(slug, originalUrl, id);

    revalidatePath("/");
    return { success: true };
}

export async function deleteLink(
    id: number,
    slug: string,
): Promise<LinkResult> {
    const supabase = await createClient();

    await invalidateLink(slug);

    const { error } = await supabase.rpc("delete_link", { p_id: id });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true };
}
