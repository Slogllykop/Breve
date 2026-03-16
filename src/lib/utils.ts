import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dDate = new Date(d);
    dDate.setHours(0, 0, 0, 0);

    if (dDate.getTime() === today.getTime()) return "Today";
    if (dDate.getTime() === yesterday.getTime()) return "Yesterday";

    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();

    const getOrdinal = (n: number) => {
        if (n > 3 && n < 21) return "th";
        switch (n % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    return `${day}${getOrdinal(day)} ${month} ${year}`;
}
