"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
    addWhitelistedEmail,
    getWhitelistedEmails,
    removeWhitelistedEmail,
} from "@/app/(dashboard)/settings/actions";

export function useWhitelistedEmails(
    initialEmails: { email: string; added_at: string; added_by: string }[],
) {
    const [emails, setEmails] = useState(initialEmails);
    const [isPending, startTransition] = useTransition();

    const refresh = async () => {
        startTransition(async () => {
            const data = await getWhitelistedEmails();
            setEmails(data);
        });
    };

    const addEmail = async (email: string) => {
        startTransition(async () => {
            const result = await addWhitelistedEmail(email);
            if (result.success) {
                toast.success("Email added to whitelist");
                await refresh();
            } else {
                toast.error(result.error || "Failed to add email");
            }
        });
    };

    const removeEmail = async (email: string) => {
        if (emails.length === 1) {
            toast.error("Cannot remove the last whitelisted email");
            return;
        }

        startTransition(async () => {
            const result = await removeWhitelistedEmail(email);
            if (result.success) {
                toast.success("Email removed from whitelist");
                await refresh();
            } else {
                toast.error(result.error || "Failed to remove email");
            }
        });
    };

    return {
        emails,
        isPending,
        addEmail,
        removeEmail,
        refresh,
    };
}
