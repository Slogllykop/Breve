import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.email) {
                const { data: isWhitelisted } = await supabase.rpc(
                    "check_whitelist",
                    { p_email: user.email },
                );

                if (!isWhitelisted) {
                    await supabase.auth.signOut();
                    return NextResponse.redirect(
                        `${origin}/?error=unauthorized`,
                    );
                }
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Return the user to the home page with an error
    return NextResponse.redirect(`${origin}/?error=auth`);
}
