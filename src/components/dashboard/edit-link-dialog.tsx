"use client";

import { IconLoader2, IconRefresh } from "@tabler/icons-react";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import type { LinkData } from "@/app/(dashboard)/actions";
import { updateLink } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateSlug, isValidSlug } from "@/lib/slug";

type EditLinkDialogProps = {
    link: LinkData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditLinkDialog({
    link,
    open,
    onOpenChange,
}: EditLinkDialogProps) {
    const [url, setUrl] = useState(link.original_url);
    const [slug, setSlug] = useState(link.slug);
    const [title, setTitle] = useState(link.title ?? "");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleRandomize = useCallback(() => {
        setSlug(generateSlug());
    }, []);

    const handleSubmit = useCallback(() => {
        setError(null);

        if (!url.trim()) {
            setError("URL is required.");
            return;
        }

        if (!slug.trim() || !isValidSlug(slug.trim())) {
            setError(
                "Slug must be alphanumeric (dashes and underscores allowed).",
            );
            return;
        }

        try {
            new URL(url.trim());
        } catch {
            setError("Please enter a valid URL.");
            return;
        }

        startTransition(async () => {
            const result = await updateLink(
                link.id,
                slug.trim(),
                url.trim(),
                title.trim() || null,
                link.slug,
            );

            if (result.success) {
                toast.success("Link updated successfully.");
                onOpenChange(false);
            } else {
                setError(result.error ?? "Failed to update link.");
            }
        });
    }, [url, slug, title, link.id, link.slug, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Link</DialogTitle>
                    <DialogDescription>
                        Update the destination URL, slug, or title.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="edit-url">Destination URL</Label>
                        <Input
                            id="edit-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isPending}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="edit-slug">Slug</Label>
                        <div className="flex gap-2">
                            <Input
                                id="edit-slug"
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                disabled={isPending}
                                required
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={handleRandomize}
                                                disabled={isPending}
                                            >
                                                <IconRefresh />
                                            </Button>
                                        }
                                    />
                                    <TooltipContent>
                                        Generate random slug
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="edit-title">
                            Title{" "}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            id="edit-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    {error ? (
                        <p className="text-destructive text-sm">{error}</p>
                    ) : null}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <IconLoader2
                                    data-icon="inline-start"
                                    className="animate-spin"
                                />
                            ) : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
