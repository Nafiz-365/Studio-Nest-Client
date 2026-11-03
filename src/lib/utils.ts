import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);

export const toDateInput = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return local.toISOString().split("T")[0];
};

export const getCurrentDate = () => new Date();

export const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

export const formatDate = (
    value: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions,
) => {
    if (!value) return "—";

    const date =
        value instanceof Date
            ? value
            : /^\d{4}-\d{2}-\d{2}$/.test(value)
              ? new Date(`${value}T12:00:00`)
              : new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        options ?? { month: "short", day: "numeric", year: "numeric" },
    ).format(date);
};

export const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

export const createId = (prefix: string) =>
    `${prefix}-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

export const getInitials = (name: string) =>
    name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

export const calculateHours = (start: string, end: string) =>
    Math.max(0, (timeToMinutes(end) - timeToMinutes(start)) / 60);
