const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SLUG_LENGTH = 6;

export function generateSlug(): string {
    const array = new Uint8Array(SLUG_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => CHARS[byte % CHARS.length]).join("");
}

export function isValidSlug(slug: string): boolean {
    return (
        /^[a-zA-Z0-9_-]+$/.test(slug) && slug.length >= 1 && slug.length <= 64
    );
}
