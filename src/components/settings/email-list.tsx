"use client";

import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function EmailList({
    emails,
    removeEmail,
    isPending,
}: {
    emails: { email: string; created_at: string }[];
    removeEmail: (email: string) => Promise<void>;
    isPending: boolean;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="overflow-hidden rounded-md border border-zinc-800 bg-black">
            {emails.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500">
                    No whitelisted emails found.
                </div>
            ) : (
                <div className="divide-y divide-zinc-800">
                    {emails.map((email) => (
                        <div
                            key={email.email}
                            className="flex items-center justify-between p-4"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-sm text-white">
                                    {email.email}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    Added{" "}
                                    {mounted
                                        ? formatDate(email.created_at)
                                        : "..."}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEmail(email.email)}
                                disabled={isPending || emails.length === 1}
                                className="text-zinc-400 hover:bg-zinc-900 hover:text-red-400"
                            >
                                <IconTrash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
