"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className="container-shell flex min-h-[calc(100svh-76px)] items-center justify-center py-16">
            <section className="w-full max-w-lg rounded-[28px] border border-line bg-surface p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                    <AlertTriangle size={25} />
                </div>
                <p className="eyebrow mt-6">Something went wrong</p>
                <h1 className="mt-3 font-display text-3xl font-semibold tracking-tighter">
                    The studio set needs a reset.
                </h1>
                <p className="mt-4 text-sm leading-6 text-muted">
                    We couldn’t render this page. Try again, and if the problem
                    continues, return to the studio directory.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="btn-primary"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                    <Link href="/studios" className="btn-secondary">
                        Browse studios
                    </Link>
                </div>
            </section>
        </main>
    );
}
