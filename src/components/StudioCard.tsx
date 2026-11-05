"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Heart, MapPin, Star, Users } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useApp } from "../lib/AppContext";
import type { Studio } from "../types";
import { cn, formatMoney } from "../lib/utils";
import Image from "next/image";

export default function StudioCard({
    studio,
    index = 0,
}: {
    studio: Studio;
    index?: number;
}) {
    const { wishlist, toggleWishlist } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [savingWishlist, setSavingWishlist] = useState(false);
    const saved = wishlist.includes(studio.id);

    const handleSave = async () => {
        setSavingWishlist(true);
        try {
            const result = await toggleWishlist(studio.id);
            if (!result.ok) {
                toast.error(result.message);
                const currentUrl =
                    pathname +
                    (searchParams?.toString()
                        ? `?${searchParams.toString()}`
                        : "");
                router.push(`/login?from=${encodeURIComponent(currentUrl)}`);
                return;
            }
            toast.success(result.message);
        } finally {
            setSavingWishlist(false);
        }
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
                duration: 0.5,
                delay: Math.min(index * 0.06, 0.24),
                ease: [0.22, 1, 0.36, 1],
            }}
            className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-surface transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_60px_rgba(24,28,18,.1)]"
        >
            <div className="relative aspect-4/3 overflow-hidden bg-soft">
                <Link
                    href={`/studios/${studio.id}`}
                    aria-label={`View ${studio.title}`}
                >
                    <Image
                        height={5000}
                        width={5000}
                        src={studio.images[0]}
                        alt={studio.title}
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.055]"
                        loading="lazy"
                        unoptimized
                    />
                </Link>
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#171915]/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-md">
                    {studio.category}
                </div>
                <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={savingWishlist}
                    className={cn(
                        "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#171915]/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-[#171915]",
                        saved && "bg-[#d9ff63] text-[#171915]",
                    )}
                    aria-label={
                        saved
                            ? `Remove ${studio.title} from wishlist`
                            : `Save ${studio.title} to wishlist`
                    }
                >
                    <Heart size={17} fill={saved ? "currentColor" : "none"} />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-[#171915] backdrop-blur-md">
                    {studio.reviewsCount > 0 ? (
                        <>
                            <Star
                                size={12}
                                fill="currentColor"
                                className="text-[#d29b22]"
                            />
                            {studio.rating.toFixed(2)}
                            <span className="font-normal text-[#65675f]">
                                ({studio.reviewsCount})
                            </span>
                        </>
                    ) : (
                        <>
                            <Star size={12} />
                            New space
                        </>
                    )}
                </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-muted">
                    <MapPin size={13} />
                    <span className="truncate">{studio.location}</span>
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                        <Users size={13} />
                        {studio.capacity}
                    </span>
                </div>
                <h3 className="mt-3 font-display text-[22px] font-semibold leading-tight tracking-[-0.045em]">
                    <Link
                        href={`/studios/${studio.id}`}
                        className="transition hover:text-[#799c22]"
                    >
                        {studio.title}
                    </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                    {studio.amenities.slice(0, 3).join(" · ")}
                </p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-line pt-5">
                    <p>
                        <span className="font-display text-xl font-bold tracking-[-0.04em]">
                            {formatMoney(studio.rate)}
                        </span>
                        <span className="text-xs text-muted"> / hour</span>
                    </p>
                    <Link href={`/studios/${studio.id}`} className="btn-small">
                        View Details
                        <ArrowUpRight size={15} />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
