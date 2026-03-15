"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useCallback, useTransition } from "react";
import { toast } from "sonner";
import { deleteLink } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type DeleteLinkDialogProps = {
    linkId: number;
    slug: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeleteLinkDialog({
    linkId,
    slug,
    open,
    onOpenChange,
}: DeleteLinkDialogProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = useCallback(() => {
        startTransition(async () => {
            const result = await deleteLink(linkId, slug);

            if (result.success) {
                toast.success("Link deleted successfully.");
                onOpenChange(false);
            } else {
                toast.error(result.error ?? "Failed to delete link.");
            }
        });
    }, [linkId, slug, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Link</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-mono text-foreground">
                            /{slug}
                        </span>
                        ? This action cannot be undone and all analytics data
                        will be lost.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <IconLoader2
                                data-icon="inline-start"
                                className="animate-spin"
                            />
                        ) : null}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
