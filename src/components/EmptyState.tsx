"use client";

import { ArrowUpRight, SearchX } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
    title: string;
    description: string;
    actionLabel: string;
    actionTo: string;
    icon?: ReactNode;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
    actionTo,
    icon,
}: Props) {
    return (
        <div className="flex min-h-90 flex-col items-center justify-center rounded-[28px] border border-dashed border-line bg-surface px-6 py-16 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-soft text-muted">
                {icon ?? <SearchX size={28} />}
            </div>
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                {title}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                {description}
            </p>
            <Link href={actionTo} className="btn-primary mt-7">
                {actionLabel}
                <ArrowUpRight size={17} />
            </Link>
        </div>
    );
}
