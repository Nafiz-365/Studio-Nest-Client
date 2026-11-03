"use client";

import Link from "next/link";
import { cn } from "../lib/utils";

export function LogoMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            className={cn("h-9 w-9", className)}
            aria-hidden="true"
        >
            <rect width="40" height="40" rx="12" fill="currentColor" />
            <circle
                cx="20"
                cy="20"
                r="10.5"
                stroke="var(--logo-cut, #171815)"
                strokeWidth="2.2"
            />
            <path
                d="M20 9.5L23.8 18.2M30.5 20L21.8 23.8M20 30.5L16.2 21.8M9.5 20L18.2 16.2"
                stroke="var(--logo-cut, #171815)"
                strokeWidth="2.2"
                strokeLinecap="round"
            />
            <circle cx="20" cy="20" r="2.2" fill="var(--logo-cut, #171815)" />
        </svg>
    );
}

export default function Logo({ light = false }: { light?: boolean }) {
    return (
        <Link
            href="/"
            className={cn(
                "group inline-flex items-center gap-2.5",
                light && "text-white",
            )}
            aria-label="StudioNest home"
        >
            <span
                className="text-[#d9ff63] transition-transform duration-500 group-hover:rotate-45"
                style={{ "--logo-cut": "#171815" } as React.CSSProperties}
            >
                <LogoMark />
            </span>
            <span className="font-display text-[21px] font-bold tracking-[-0.055em]">
                StudioNest<span className="text-[#9ac92d]">.</span>
            </span>
        </Link>
    );
}
