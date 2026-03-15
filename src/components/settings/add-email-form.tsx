"use client";

import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWhitelistedEmails } from "@/hooks/use-whitelisted-emails";

export function AddEmailForm({
    emails,
}: {
    emails: { email: string; added_at: string; added_by: string }[];
}) {
    const { addEmail, isPending } = useWhitelistedEmails(emails);
    const [newEmail, setNewEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes("@")) return;

        await addEmail(newEmail);
        setNewEmail("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <Input
                type="email"
                placeholder="Add email to whitelist..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isPending}
                required
            />
            <Button type="submit" disabled={isPending || !newEmail}>
                {isPending ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add
                    </>
                )}
            </Button>
        </form>
    );
}
