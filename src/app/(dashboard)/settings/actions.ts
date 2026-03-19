"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.email("Invalid email address");

export async function getWhitelistedEmails() {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_whitelisted_emails");

    if (error) {
        console.error("Error fetching whitelisted emails:", error);
        return [];
    }

    return data || [];
}

export async function addWhitelistedEmail(email: string) {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }
    const validEmail = parsed.data;

    const supabase = await createClient();

    const { error } = await supabase.rpc("add_whitelisted_email", {
        p_email: validEmail,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/settings");
    return { success: true };
}

export async function removeWhitelistedEmail(email: string) {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }
    const validEmail = parsed.data;

    const supabase = await createClient();

    const { error } = await supabase.rpc("remove_whitelisted_email", {
        p_email: validEmail.toLowerCase(),
    });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/settings");
    return { success: true };
}
