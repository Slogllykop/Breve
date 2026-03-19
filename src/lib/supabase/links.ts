import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getLink = cache(async (linkId: number) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("id", linkId)
        .single();

    if (error || !data) return null;
    return data;
});
