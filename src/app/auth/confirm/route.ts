import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.email) {
                const { data: isWhitelisted } = await supabase.rpc(
                    "check_email_whitelisted",
                    { p_email: user.email },
                );

                if (!isWhitelisted) {
                    await supabase.auth.signOut();
                    return NextResponse.redirect(
                        new URL("/?error=unauthorized", requestUrl.origin),
                    );
                }
            }

            return NextResponse.redirect(new URL(next, requestUrl.origin));
        }
    }

    // Return the user to the home page with an error
    return NextResponse.redirect(new URL("/?error=auth", requestUrl.origin));
}
