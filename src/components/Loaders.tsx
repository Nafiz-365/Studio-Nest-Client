"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Logo from "./Logo";

export function StudioCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-[24px] border border-line bg-surface">
            <Skeleton className="aspect-4/3 rounded-none" />
            <div className="space-y-4 p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-28 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-bg">
            <div className="flex flex-col items-center gap-6">
                <div className="animate-pulse">
                    <Logo />
                </div>
                <div className="h-1 w-36 overflow-hidden rounded-full bg-soft">
                    <div className="loader-bar h-full w-1/2 rounded-full bg-[#b8e442]" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                    Setting the stage
                </p>
            </div>
        </div>
    );
}
