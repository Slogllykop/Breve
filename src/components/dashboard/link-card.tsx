"use client";

import {
    IconArrowRight,
    IconBarcode,
    IconCheck,
    IconCopy,
    IconDownload,
    IconExternalLink,
    IconLink,
    IconPencil,
    IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { LinkData } from "@/app/(dashboard)/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const qrRef = useRef<HTMLCanvasElement>(null);

    const shortUrl = `${baseUrl}/${link.slug}`;

    async function handleCopy() {
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleOpenAnalytics() {
        router.push(`/links/${link.id}`);
    }

    function downloadQrCode() {
        const canvas = qrRef.current;
        if (!canvas) return;

        const objectUrl = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = `${link.slug}-qr.png`;
        anchor.click();
    }

    return (
        <>
            <article className="group relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-b from-white/4 to-white/1 transition-all duration-300 hover:border-white/[0.14] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
                <TooltipProvider>
                    {/* Main Content */}
                    <div className="flex gap-5 p-5">
                        {/* QR Code */}
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <button
                                        type="button"
                                        onClick={() => setQrOpen(true)}
                                        className="group/qr relative shrink-0 cursor-pointer self-start rounded-xl border border-white/10 bg-white p-0 shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105"
                                    >
                                        <QrCode
                                            ref={qrRef}
                                            url={shortUrl}
                                            size={100}
                                            className="rounded-xl"
                                        />
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover/qr:opacity-100">
                                            <IconBarcode className="size-5 text-white" />
                                        </div>
                                    </button>
                                }
                            />
                            <TooltipContent>View QR code</TooltipContent>
                        </Tooltip>

                        {/* Info Column */}
                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                            {/* Title + Click Badge */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="truncate font-medium text-[15px] text-white leading-snug">
                                        {link.title || "Untitled link"}
                                    </h3>
                                    <p className="mt-0.5 font-mono text-sm text-white/50">
                                        /{link.slug}
                                    </p>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="shrink-0 bg-white/[0.07] font-mono text-white/80 tabular-nums"
                                >
                                    {link.click_count.toLocaleString()}{" "}
                                    {link.click_count === 1 ? "click" : "clicks"}
                                </Badge>
                            </div>

                            {/* Short URL */}
                            <div className="flex items-center gap-1.5 text-emerald-400/80 text-sm">
                                <IconLink className="size-3.5 shrink-0" />
                                <span className="truncate">{shortUrl}</span>
                            </div>

                            {/* Long URL */}
                            <a
                                href={link.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex max-w-full items-center gap-1.5 truncate text-white/40 text-xs transition-colors hover:text-white/65"
                            >
                                <IconExternalLink className="size-3 shrink-0" />
                                <span className="truncate">
                                    {link.original_url}
                                </span>
                            </a>
                        </div>

                        {/* Desktop Action Column */}
                        <div className="hidden shrink-0 flex-col gap-1.5 sm:flex">
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-white/10 bg-white/3 text-white/70 hover:bg-white/8 hover:text-white"
                                            onClick={() => setEditOpen(true)}
                                        >
                                            <IconPencil className="size-3.5" />
                                            Edit
                                        </Button>
                                    }
                                />
                                <TooltipContent>Edit link</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-red-500/20 bg-red-500/6 text-red-400/80 hover:border-red-500/30 hover:bg-red-500/15 hover:text-red-300"
                                            onClick={() => setDeleteOpen(true)}
                                        >
                                            <IconTrash className="size-3.5" />
                                            Delete
                                        </Button>
                                    }
                                />
                                <TooltipContent>Delete link</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex flex-wrap items-center gap-2 border-white/6 border-t bg-white/2 px-5 py-3">
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-white/60 text-xs hover:bg-white/8 hover:text-white"
                                        onClick={() => {
                                            void handleCopy();
                                        }}
                                    >
                                        {copied ? (
                                            <IconCheck className="size-3.5" />
                                        ) : (
                                            <IconCopy className="size-3.5" />
                                        )}
                                        {copied ? "Copied!" : "Copy URL"}
                                    </Button>
                                }
                            />
                            <TooltipContent>Copy the short link</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-white/60 text-xs hover:bg-white/8 hover:text-white"
                                        onClick={downloadQrCode}
                                    >
                                        <IconDownload className="size-3.5" />
                                        QR Code
                                    </Button>
                                }
                            />
                            <TooltipContent>Download QR code</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-white/60 text-xs hover:bg-white/8 hover:text-white"
                                        nativeButton={false}
                                        render={
                                            <a
                                                href={shortUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <IconExternalLink className="size-3.5" />
                                                Open link
                                            </a>
                                        }
                                    />
                                }
                            />
                            <TooltipContent>
                                Open link in new tab
                            </TooltipContent>
                        </Tooltip>

                        {/* Mobile-only Edit/Delete */}
                        <div className="flex items-center gap-1 sm:hidden">
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-white/60 text-xs hover:bg-white/8 hover:text-white"
                                            onClick={() => setEditOpen(true)}
                                        >
                                            <IconPencil className="size-3.5" />
                                            Edit
                                        </Button>
                                    }
                                />
                                <TooltipContent>Edit link</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-red-400/70 text-xs hover:bg-red-500/10 hover:text-red-300"
                                            onClick={() => setDeleteOpen(true)}
                                        >
                                            <IconTrash className="size-3.5" />
                                            Delete
                                        </Button>
                                    }
                                />
                                <TooltipContent>Delete link</TooltipContent>
                            </Tooltip>
                        </div>

                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        size="sm"
                                        className="ml-auto h-8 bg-white text-black text-xs hover:bg-white/90"
                                        onClick={handleOpenAnalytics}
                                    >
                                        View analytics
                                        <IconArrowRight className="size-3.5" />
                                    </Button>
                                }
                            />
                            <TooltipContent>
                                View detailed analytics
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </article>

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
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-sm">
                            /{link.slug}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="mx-auto aspect-square w-full max-w-[260px] rounded-[1.5rem] bg-white p-5 text-black">
                            <QrCode
                                url={shortUrl}
                                size={220}
                                className="rounded-[1rem]"
                            />
                        </div>
                        <div className="space-y-2 text-center">
                            <p className="font-medium text-sm text-white">
                                This QR encodes the full absolute short URL.
                            </p>
                            <p className="truncate text-muted-foreground text-xs">
                                {shortUrl}
                            </p>
                        </div>
                        <Button className="w-full" onClick={downloadQrCode}>
                            <IconDownload data-icon="inline-start" />
                            Download PNG
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
