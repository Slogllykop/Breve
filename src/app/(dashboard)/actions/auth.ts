"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const sendOtpSchema = z.object({
    email: z.email("Invalid email address"),
    origin: z.url("Invalid origin URL"),
});

export type AuthResult = {
    success: boolean;
    error?: string;
};

/**
 * Sends a one-time password to the given email after verifying
 * the email is whitelisted. Used for passwordless login.
 */
export async function sendOtp(
    email: string,
    origin: string,
): Promise<AuthResult> {
    const parsed = sendOtpSchema.safeParse({ email, origin });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    const validEmail = parsed.data.email;
    const validOrigin = parsed.data.origin;

    const supabase = await createClient();

    const { data: isWhitelisted, error: checkError } = await supabase.rpc(
        "check_email_whitelisted",
        { p_email: validEmail },
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
        email: validEmail,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: `${validOrigin}/auth/confirm`,
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/** Signs the current user out and revalidates the entire layout. */
export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
}
