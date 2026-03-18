import type { Metadata } from "next";
import { RedirectClient } from "@/components/redirect/redirect-client";
import { getLinkBySlug } from "./actions";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const { data: link } = await getLinkBySlug(slug);

    if (!link) {
        return {
            title: "Link Not Found | Breve",
            description:
                "The link you are looking for does not exist or has been removed.",
        };
    }

    const title = "Secure Redirect | Breve";
    const description =
        "You are being redirected securely via Breve, the premium URL shortener.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function RedirectPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div className="flex min-h-dvh items-center justify-center bg-black">
            <RedirectClient slug={slug} />
        </div>
    );
}
