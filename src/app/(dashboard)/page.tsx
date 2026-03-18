import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { LoginForm } from "@/components/auth/login-form";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { createClient } from "@/lib/supabase/server";
import { getLinks } from "./actions";

export const metadata: Metadata = {
    title: "Dashboard - Breve",
    description:
        "Manage your links and view detailed analytics on your Breve dashboard.",
};

export default async function DashboardPage(props: {
    searchParams: Promise<{ error?: string }>;
}) {
    const searchParams = await props.searchParams;
    const errorMessage =
        searchParams.error === "unauthorized"
            ? "This email is not authorized to access the dashboard."
            : searchParams.error === "auth"
              ? "Authentication failed. Please try again."
              : undefined;

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <LoginForm initialError={errorMessage} />;
    }

    const links = await getLinks();

    // Derive base URL from request headers
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    const baseUrl = `${protocol}://${host}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Breve",
        description: "A premium URL shortener with detailed analytics.",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        author: {
            "@type": "Organization",
            name: "Breve Team",
        },
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
    };

    return (
        <>
            <Script
                id="structured-data"
                type="application/ld+json"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe to inject this way
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DashboardView
                email={user.email ?? ""}
                links={links}
                baseUrl={baseUrl}
            />
        </>
    );
}
