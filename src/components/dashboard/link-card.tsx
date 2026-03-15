"use client";

import {
    IconChartBar,
    IconCheck,
    IconCopy,
    IconDots,
    IconExternalLink,
    IconPencil,
    IconQrcode,
    IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { LinkData } from "@/app/(dashboard)/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteLinkDialog } from "./delete-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";
import { QrCode } from "./qr-code";

type LinkCardProps = {
    link: LinkData;
    baseUrl: string;
};

export function LinkCard({ link, baseUrl }: LinkCardProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shortUrl = `${baseUrl}/${link.slug}`;

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [shortUrl]);

    return (
        <>
            <Card className="group transition-colors hover:border-foreground/20">
                <CardHeader className="flex-row items-start justify-between pb-2">
                    <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="font-mono text-sm">
                                /{link.slug}
                            </CardTitle>
                            <Badge variant="secondary" className="tabular-nums">
                                {link.click_count}{" "}
                                {link.click_count === 1 ? "click" : "clicks"}
                            </Badge>
                        </div>
                        {link.title ? (
                            <CardDescription className="text-xs">
                                {link.title}
                            </CardDescription>
                        ) : null}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                >
                                    <IconDots />
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => setEditOpen(true)}
                                >
                                    <IconPencil data-icon="inline-start" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setQrOpen(true)}
                                >
                                    <IconQrcode data-icon="inline-start" />
                                    QR Code
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    render={
                                        <Link href={`/links/${link.id}`}>
                                            <IconChartBar data-icon="inline-start" />
                                            Analytics
                                        </Link>
                                    }
                                />
                                <DropdownMenuItem
                                    onClick={() => setDeleteOpen(true)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <IconTrash data-icon="inline-start" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className="flex items-center gap-2 pt-0">
                    <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 truncate text-muted-foreground text-xs hover:text-foreground"
                    >
                        {link.original_url}
                    </a>

                    <div className="ml-auto flex shrink-0 items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7"
                                            onClick={handleCopy}
                                        >
                                            {copied ? (
                                                <IconCheck />
                                            ) : (
                                                <IconCopy />
                                            )}
                                        </Button>
                                    }
                                />
                                <TooltipContent>
                                    {copied ? "Copied!" : "Copy short URL"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7"
                                            nativeButton={false}
                                            render={
                                                <a
                                                    href={shortUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <IconExternalLink />
                                                </a>
                                            }
                                        />
                                    }
                                />
                                <TooltipContent>Open short URL</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardContent>
            </Card>

            <EditLinkDialog
                link={link}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteLinkDialog
                linkId={link.id}
                slug={link.slug}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />

            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-sm">
                            /{link.slug}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                        <QrCode url={shortUrl} size={200} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
