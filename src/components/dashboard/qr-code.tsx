"use client";

import { QRCodeCanvas } from "qrcode.react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type QrCodeProps = {
    url: string;
    size?: number;
    className?: string;
};

export const QrCode = forwardRef<HTMLCanvasElement, QrCodeProps>(
    function QrCode({ url, size = 128, className }, ref) {
        return (
            <QRCodeCanvas
                ref={ref}
                value={url}
                size={size}
                marginSize={2}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
                className={cn("block h-full w-full", className)}
            />
        );
    },
);
