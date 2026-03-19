"use client";

import { IconLoader2, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddEmailForm({
    addEmail,
    isPending,
}: {
    addEmail: (email: string) => Promise<void>;
    isPending: boolean;
}) {
    const [newEmail, setNewEmail] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes("@")) return;

        await addEmail(newEmail);
        setNewEmail("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 flex flex-col items-stretch gap-2 sm:flex-row sm:items-end"
        >
            <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="add-email-input">Email address</Label>
                <Input
                    id="add-email-input"
                    type="email"
                    placeholder="Add email to whitelist..."
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={isPending}
                    required
                />
            </div>
            <Button
                type="submit"
                disabled={isPending || !newEmail}
                className="w-full sm:w-auto"
            >
                {isPending ? (
                    <IconLoader2
                        aria-hidden="true"
                        className="h-4 w-4 animate-spin"
                    />
                ) : (
                    <>
                        <IconPlus aria-hidden="true" className="mr-2 h-4 w-4" />
                        Add
                    </>
                )}
            </Button>
        </form>
    );
}
