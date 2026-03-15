"use client";

import { useCallback, useTransition } from "react";
import { signOut } from "@/app/(dashboard)/actions";

export function useAuth() {
    const [isPending, startTransition] = useTransition();

    const handleSignOut = useCallback(() => {
        startTransition(async () => {
            await signOut();
        });
    }, []);

    return {
        signOut: handleSignOut,
        isSigningOut: isPending,
    };
}
