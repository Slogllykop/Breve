"use client";

import { IconLoader2, IconPlus, IconRefresh } from "@tabler/icons-react";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { createLink } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSlug, isValidSlug } from "@/lib/slug";

export function CreateLinkDialog() {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [slug, setSlug] = useState(() => generateSlug());
    const [title, setTitle] = useState("");
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
            setError("Please enter a valid URL (e.g. https://example.com).");
            return;
        }

        startTransition(async () => {
            const result = await createLink(
                slug.trim(),
                url.trim(),
                title.trim() || null,
            );

            if (result.success) {
                toast.success("Link created successfully.");
                setOpen(false);
                setUrl("");
                setSlug(generateSlug());
                setTitle("");
            } else {
                setError(result.error ?? "Failed to create link.");
            }
        });
    }, [url, slug, title]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button>
                        <IconPlus data-icon="inline-start" />
                        New Link
                    </Button>
                }
            />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Link</DialogTitle>
                    <DialogDescription>
                        Shorten a URL with a custom or random suffix.
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
                        <Label htmlFor="create-url">Destination URL</Label>
                        <Input
                            id="create-url"
                            type="url"
                            placeholder="https://example.com/very-long-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isPending}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="create-slug">Slug</Label>
                        <div className="flex gap-2">
                            <Input
                                id="create-slug"
                                type="text"
                                placeholder="custom-slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                disabled={isPending}
                                required
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleRandomize}
                                disabled={isPending}
                            >
                                <IconRefresh />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="create-title">
                            Title{" "}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            id="create-title"
                            type="text"
                            placeholder="My Link"
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
                            Create Link
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
