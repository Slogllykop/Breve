"use client";

import type { LinkData } from "@/app/(dashboard)/actions";
import { Toaster } from "@/components/ui/sonner";
import { CreateLinkDialog } from "./create-link-dialog";
import { Header } from "./header";
import { LinkList } from "./link-list";

type DashboardViewProps = {
    email: string;
    links: LinkData[];
    baseUrl: string;
};

export function DashboardView({ email, links, baseUrl }: DashboardViewProps) {
    return (
        <div className="min-h-screen">
            <Header email={email} />

            <main className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl tracking-tight">
                            Links
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {links.length}{" "}
                            {links.length === 1 ? "link" : "links"} total
                        </p>
                    </div>
                    <CreateLinkDialog />
                </div>

                <LinkList links={links} baseUrl={baseUrl} />
            </main>

            <Toaster />
        </div>
    );
}
