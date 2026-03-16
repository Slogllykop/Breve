"use client";

import { useWhitelistedEmails } from "@/hooks/use-whitelisted-emails";
import { AddEmailForm } from "./add-email-form";
import { EmailList } from "./email-list";

export function WhitelistManager({
    initialEmails,
}: {
    initialEmails: { email: string; created_at: string }[];
}) {
    const { emails, addEmail, removeEmail, isPending } =
        useWhitelistedEmails(initialEmails);

    return (
        <>
            <AddEmailForm addEmail={addEmail} isPending={isPending} />
            <EmailList
                emails={emails}
                removeEmail={removeEmail}
                isPending={isPending}
            />
        </>
    );
}
