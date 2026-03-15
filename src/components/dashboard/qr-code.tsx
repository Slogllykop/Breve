"use client";

import { useEffect, useRef } from "react";

type QrCodeProps = {
    url: string;
    size?: number;
};

export function QrCode({ url, size = 128 }: QrCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Generate a simple QR-like pattern
        // For a real QR code we'd use a library, but this generates
        // a deterministic pattern from the URL for visual representation
        drawQrCode(ctx, url, size);
    }, [url, size]);

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="rounded-md"
        />
    );
}

function drawQrCode(ctx: CanvasRenderingContext2D, data: string, size: number) {
    const modules = 21; // QR version 1
    const moduleSize = Math.floor(size / modules);
    const padding = Math.floor((size - moduleSize * modules) / 2);

    // Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Generate deterministic pattern from data
    const hash = simpleHash(data);
    const bits = generateBits(hash, modules * modules);

    ctx.fillStyle = "#000000";

    // Draw finder patterns (top-left, top-right, bottom-left)
    drawFinderPattern(ctx, padding, padding, moduleSize);
    drawFinderPattern(ctx, padding + moduleSize * 14, padding, moduleSize);
    drawFinderPattern(ctx, padding, padding + moduleSize * 14, moduleSize);

    // Draw data modules
    for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
            // Skip finder pattern areas
            if (isFinderArea(row, col, modules)) continue;

            if (bits[row * modules + col]) {
                ctx.fillRect(
                    padding + col * moduleSize,
                    padding + row * moduleSize,
                    moduleSize,
                    moduleSize,
                );
            }
        }
    }
}

function drawFinderPattern(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    moduleSize: number,
) {
    // Outer border
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
    // Inner white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
        x + moduleSize,
        y + moduleSize,
        moduleSize * 5,
        moduleSize * 5,
    );
    // Center
    ctx.fillStyle = "#000000";
    ctx.fillRect(
        x + moduleSize * 2,
        y + moduleSize * 2,
        moduleSize * 3,
        moduleSize * 3,
    );
}

function isFinderArea(row: number, col: number, modules: number): boolean {
    // Top-left
    if (row < 8 && col < 8) return true;
    // Top-right
    if (row < 8 && col >= modules - 8) return true;
    // Bottom-left
    if (row >= modules - 8 && col < 8) return true;
    return false;
}

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

function generateBits(seed: number, count: number): boolean[] {
    const bits: boolean[] = [];
    let state = seed;
    for (let i = 0; i < count; i++) {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        bits.push(state % 3 === 0);
    }
    return bits;
}
