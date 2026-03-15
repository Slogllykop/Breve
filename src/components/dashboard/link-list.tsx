"use client";

import { IconLink } from "@tabler/icons-react";
import type { LinkData } from "@/app/(dashboard)/actions";
import { LinkCard } from "./link-card";

type LinkListProps = {
    links: LinkData[];
    baseUrl: string;
};

export function LinkList({ links, baseUrl }: LinkListProps) {
    if (links.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16">
                <IconLink className="size-8 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                    No links yet. Create your first short link.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {links.map((link) => (
                <LinkCard key={link.id} link={link} baseUrl={baseUrl} />
            ))}
        </div>
    );
}
