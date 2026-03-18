import { ImageResponse } from "next/og";
import { getLinkBySlug } from "./actions";

export const runtime = "edge";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const { data: link } = await getLinkBySlug(slug);

    const title = link?.original_url
        ? `Redirecting to ${link.original_url}`
        : "Link Not Found";

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
