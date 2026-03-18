"use client";

import { IconLogout, IconSettings } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/seperator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

type HeaderProps = {
    email: string;
};

export function Header({ email }: HeaderProps) {
    const { signOut, isSigningOut } = useAuth();

    return (
        <header className="border-border/40 border-b">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Breve Logo"
                        width={30}
                        height={30}
                        className="rounded-sm"
                    />
                    <h1 className="font-semibold text-lg tracking-tight">
                        Breve
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm">
                        {email}
                    </span>
                    <Separator orientation="vertical" className="h-5" />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        nativeButton={false}
                                        render={
                                            <Link href="/settings">
                                                <IconSettings
                                                    aria-hidden="true"
                                                    data-icon="inline-start"
                                                />
                                                Settings
                                            </Link>
                                        }
                                    />
                                }
                            />
                            <TooltipContent>Manage preferences</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={signOut}
                                        disabled={isSigningOut}
                                    >
                                        <IconLogout
                                            aria-hidden="true"
                                            data-icon="inline-start"
                                        />
                                        Sign out
                                    </Button>
                                }
                            />
                            <TooltipContent>Log out of session</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </header>
    );
}
