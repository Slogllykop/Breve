import { redis } from "./client";

type CachedLink = {
    original_url: string;
    link_id: number;
};

const LINK_PREFIX = "link:";
const CLICKS_PREFIX = "clicks:";

export async function cacheLink(
    slug: string,
    originalUrl: string,
    linkId: number,
): Promise<void> {
    await redis.set<CachedLink>(`${LINK_PREFIX}${slug}`, {
        original_url: originalUrl,
        link_id: linkId,
    });
}

export async function getCachedLink(slug: string): Promise<CachedLink | null> {
    return redis.get<CachedLink>(`${LINK_PREFIX}${slug}`);
}

export async function invalidateLink(slug: string): Promise<void> {
    await redis.del(`${LINK_PREFIX}${slug}`);
}

export async function incrementClickCount(linkId: number): Promise<number> {
    return redis.incr(`${CLICKS_PREFIX}${linkId}`);
}

export async function getCachedClickCount(
    linkId: number,
): Promise<number | null> {
    return redis.get<number>(`${CLICKS_PREFIX}${linkId}`);
}
