import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const { id } = params;
    const linkId = parseInt(id, 10);

    let title = "Analytics Dashboard";
    if (!Number.isNaN(linkId)) {
        const supabase = await createClient();
        const { data } = await supabase
            .from("links")
            .select("title")
            .eq("id", linkId)
            .single();
        if (data?.title) {
            title = `${data.title} Analytics`;
        }
    }

    return new ImageResponse(
        <div
            style={{
                background: "black",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                    padding: "20px 40px",
                }}
            >
                <span
                    style={{
                        fontSize: 84,
                        fontWeight: "bold",
                        color: "white",
                        letterSpacing: "-0.05em",
                    }}
                >
                    Breve
                </span>
            </div>
            <div
                style={{
                    marginTop: 40,
                    fontSize: 48,
                    color: "white",
                    textAlign: "center",
                    maxWidth: "80%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {title}
            </div>
        </div>,
        {
            ...size,
        },
    );
}
