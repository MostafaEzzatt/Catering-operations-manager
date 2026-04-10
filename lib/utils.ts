import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formateARDate(input: string | Date, time: boolean = false) {
  const date = input instanceof Date ? input : new Date(input);

  return time
    ? new Intl.DateTimeFormat("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date)
    : new Intl.DateTimeFormat("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
}
