import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Breve - Premium URL Shortener";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
                        fontSize: 128,
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
                    fontSize: 32,
                    color: "white",
                    opacity: 0.8,
                }}
            >
                Simple and Self-hosted URL Shortener
            </div>
        </div>,
        {
            ...size,
        },
    );
}
