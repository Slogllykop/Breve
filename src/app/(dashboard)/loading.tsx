import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
    return (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
            <IconLoader2 className="h-8 w-8 animate-spin text-zinc-500" />
            <p className="font-medium text-sm text-zinc-500">Loading...</p>
        </div>
    );
}
