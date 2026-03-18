"use client";

import { IconArrowLeft, IconLoader2, IconMail } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import { sendOtp } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "email" | "sent";

interface LoginFormProps {
    initialError?: string;
}

export function LoginForm({ initialError }: LoginFormProps) {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(initialError ?? null);
    const [isPending, startTransition] = useTransition();

    const handleSendLink = useCallback(() => {
        if (!email.trim()) return;
        setError(null);

        startTransition(async () => {
            const result = await sendOtp(
                email.trim().toLowerCase(),
                window.location.origin,
            );
            if (result.success) {
                setStep("sent");
            } else {
                setError(result.error ?? "Failed to send login link.");
            }
        });
    }, [email]);

    const handleBack = useCallback(() => {
        setStep("email");
        setError(null);
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6 px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Image
                        src="/logo.png"
                        alt="Breve Logo"
                        width={48}
                        height={48}
                        className="rounded-lg shadow-lg"
                    />
                    <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-2xl tracking-tight">
                            Breve
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {step === "email"
                            ? "Enter your email to sign in"
                            : `We sent a magic link to ${email}`}
                    </p>
                </div>

                {step === "email" ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendLink();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="login-email">Email address</Label>
                            <Input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                                required
                                aria-describedby={
                                    error ? "login-error" : undefined
                                }
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending || !email.trim()}
                        >
                            {isPending ? (
                                <IconLoader2
                                    aria-hidden="true"
                                    data-icon="inline-start"
                                    className="animate-spin"
                                />
                            ) : (
                                <IconMail
                                    aria-hidden="true"
                                    data-icon="inline-start"
                                />
                            )}
                            Send Login Link
                        </Button>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center text-sm">
                            Click the secure link we sent to your inbox to sign
                            in instantly.
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleBack}
                            disabled={isPending}
                        >
                            <IconArrowLeft
                                aria-hidden="true"
                                data-icon="inline-start"
                            />
                            Back
                        </Button>
                    </div>
                )}

                {error ? (
                    <p
                        id="login-error"
                        className="text-center text-destructive text-sm"
                        role="alert"
                    >
                        {error}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
