import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Let auth callback through
    if (pathname.startsWith("/auth")) {
        return await updateSession(request);
    }

    // Let API routes through
    if (pathname.startsWith("/api")) {
        return await updateSession(request);
    }

    // All other routes (dashboard and slug redirects): just refresh session
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
