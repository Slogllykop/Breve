import { headers } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { createClient } from "@/lib/supabase/server";
import { getLinks } from "./actions";

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

    return (
        <DashboardView
            email={user.email ?? ""}
            links={links}
            baseUrl={baseUrl}
        />
    );
}
