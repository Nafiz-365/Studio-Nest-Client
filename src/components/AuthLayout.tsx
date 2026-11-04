"use client";

import { ArrowLeft, Check, Star } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function GoogleButton({
    onClick,
    label,
    disabled = false,
}: {
    onClick: () => void | Promise<void>;
    label: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="btn-secondary w-full min-h-12! disabled:cursor-not-allowed disabled:opacity-60"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="#4285F4"
                    d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.31 2.99-7.33Z"
                />
                <path
                    fill="#34A853"
                    d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.06v2.6A10 10 0 0 0 12 22Z"
                />
                <path
                    fill="#FBBC05"
                    d="M6.39 13.89A6 6 0 0 1 6.07 12c0-.66.11-1.3.31-1.89v-2.6H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.49l3.33-2.6Z"
                />
                <path
                    fill="#EA4335"
                    d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.51l3.33 2.6C7.18 7.74 9.39 5.98 12 5.98Z"
                />
            </svg>
            {label}
        </button>
    );
}

export default function AuthLayout({
    children,
    mode,
}: {
    children: ReactNode;
    mode: "login" | "register";
}) {
    return (
        <div className="container-shell grid min-h-svh min-w-0 items-start gap-0 py-4 sm:py-8 lg:items-stretch lg:grid-cols-[.9fr_1.1fr] lg:py-12">
            <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative hidden min-h-170 overflow-hidden rounded-[30px] bg-[#171915] lg:block"
            >
                <Image
                    height={8000}
                    width={5000}
                    src={
                        mode === "login"
                            ? "/images/studio-podcast.jpg"
                            : "/images/studio-loft.jpg"
                    }
                    alt="A welcoming creative production studio"
                    className="absolute inset-0 h-full w-full object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#141610] via-[#141610]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-12">
                    <div className="flex gap-1 text-[#d9ff63]">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                        ))}
                    </div>
                    <blockquote className="mt-5 font-display text-3xl font-medium leading-[1.15] tracking-[-0.045em]">
                        “The right room changes the energy of the whole
                        production.”
                    </blockquote>
                    <p className="mt-5 text-xs text-white/55">
                        Nina Okafor · Photographer & StudioNest creator
                    </p>
                    <div className="mt-8 space-y-3 border-t border-white/15 pt-6 text-xs text-white/65">
                        {[
                            "Verified independent studio hosts",
                            "Clear rates and booking records",
                            "Real support when plans change",
                        ].map((item) => (
                            <p key={item} className="flex items-center gap-2.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d9ff63] text-[#171915]">
                                    <Check size={11} strokeWidth={3} />
                                </span>
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="flex w-full items-center justify-center rounded-[24px] border border-line bg-surface px-4 py-7 sm:rounded-[30px] sm:px-10 sm:py-10 lg:ml-5 lg:px-14 lg:py-12 xl:px-20"
            >
                <div className="min-w-0 w-full max-w-md">
                    <Link
                        href="/"
                        className="mb-7 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-text sm:mb-10"
                    >
                        <ArrowLeft size={15} />
                        Back to StudioNest
                    </Link>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
