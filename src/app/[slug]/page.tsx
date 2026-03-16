import { RedirectClient } from "@/components/redirect/redirect-client";

export default async function RedirectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <RedirectClient slug={slug} />
        </div>
    );
}
