"use client";

import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { categories } from "../data/studios";
import Logo from "./Logo";

function XLogo({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
    );
}

function InstagramLogo({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    );
}

function LinkedinLogo({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M5.2 8.1A2.1 2.1 0 1 1 5.2 4a2.1 2.1 0 0 1 0 4.1ZM3.4 9.8h3.6V20H3.4V9.8Zm5.8 0h3.5v1.4h.1c.5-.9 1.7-1.8 3.5-1.8 3.7 0 4.4 2.4 4.4 5.5V20h-3.6v-4.5c0-1.1 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5V20H9.2V9.8Z" />
        </svg>
    );
}

function YoutubeLogo({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.7 12 4.7 12 4.7s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2C2 8.9 2 12 2 12s0 3.1.4 4.8a2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8ZM10 15.8V8.2l6 3.8-6 3.8Z" />
        </svg>
    );
}

const COPYRIGHT_YEAR = "2026";

export default function Footer() {
    const [email, setEmail] = useState("");

    const subscribe = (event: FormEvent) => {
        event.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Enter a valid email address to join the field notes.");
            return;
        }
        const existing = JSON.parse(
            localStorage.getItem("studionest.newsletter") ?? "[]",
        ) as string[];
        if (!existing.includes(email))
            localStorage.setItem(
                "studionest.newsletter",
                JSON.stringify([...existing, email]),
            );
        toast.success(
            "You’re on the list. Expect useful studio notes, never noise.",
        );
        setEmail("");
    };

    return (
        <footer className="border-t border-white/10 bg-[#171915] text-[#f4f2e9]">
            <div className="container-shell py-16 sm:py-20">
                <div className="grid gap-12 lg:grid-cols-[1.25fr_.75fr_.75fr_1.25fr] lg:gap-10">
                    <div>
                        <Logo light />
                        <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
                            Making remarkable creative space easier to find,
                            book, and share. Built for the people behind the
                            work.
                        </p>
                        <div className="mt-7 flex items-center gap-2">
                            {[
                                {
                                    label: "X",
                                    href: "https://x.com",
                                    icon: <XLogo />,
                                },
                                {
                                    label: "Instagram",
                                    href: "https://instagram.com",
                                    icon: <InstagramLogo />,
                                },
                                {
                                    label: "LinkedIn",
                                    href: "https://linkedin.com",
                                    icon: <LinkedinLogo />,
                                },
                                {
                                    label: "YouTube",
                                    href: "https://youtube.com",
                                    icon: <YoutubeLogo />,
                                },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/65 transition hover:border-[#d9ff63] hover:bg-[#d9ff63] hover:text-[#171915]"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                            Navigate
                        </h3>
                        <div className="mt-5 flex flex-col items-start gap-3.5 text-sm">
                            {[
                                ["Explore studios", "/studios"],
                                ["How it works", "/how-it-works"],
                                ["About StudioNest", "/about"],
                                ["Host your space", "/add-studio"],
                                ["My bookings", "/my-bookings"],
                            ].map(([label, to]) => (
                                <Link
                                    key={to}
                                    href={to}
                                    className="text-white/70 transition hover:text-[#d9ff63]"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                            Popular spaces
                        </h3>
                        <div className="mt-5 flex flex-col items-start gap-3.5 text-sm">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={`/studios?category=${encodeURIComponent(category.name)}`}
                                    className="text-white/70 transition hover:text-[#d9ff63]"
                                >
                                    {category.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-display text-xl font-semibold tracking-[-0.035em]">
                            Field notes for better production days.
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-white/50">
                            New spaces, practical host guides, and studio craft.
                            Twice a month.
                        </p>
                        <form
                            onSubmit={subscribe}
                            className="mt-6 flex rounded-full border border-white/15 bg-white/5 p-1.5 focus-within:border-[#d9ff63]/60"
                        >
                            <label
                                htmlFor="newsletter-email"
                                className="sr-only"
                            >
                                Email address
                            </label>
                            <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@studio.com"
                                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35"
                                suppressHydrationWarning
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9ff63] text-[#171915] transition hover:scale-105"
                                aria-label="Subscribe to newsletter"
                            >
                                <ArrowUpRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/40 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <p>
                        © {COPYRIGHT_YEAR} StudioNest. Creative space,
                        thoughtfully shared.
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        <Link
                            href="/terms"
                            className="transition hover:text-white"
                        >
                            Terms & privacy
                        </Link>
                        <span>Bookings subject to host agreement</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
