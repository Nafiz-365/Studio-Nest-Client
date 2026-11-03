"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    RotateCcw,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmptyState from "../components/EmptyState";
import { StudioCardSkeleton } from "../components/Loaders";
import StudioCard from "../components/StudioCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { categories } from "../data/studios";
import { useLoading } from "../lib/useLoading";
import { formatMoney } from "../lib/utils";
import type { Studio } from "../types";

export default function Studios({ studios }: { studios: Studio[] }) {
    const loading = useLoading();
    const router = useRouter();
    const pathname = usePathname() || "/studios";
    const searchParams = useSearchParams();
    const query = searchParams?.get("q") ?? "";
    const category = searchParams?.get("category") ?? "All";
    const [location, setLocation] = useState("All");
    const [maxPrice, setMaxPrice] = useState(250);
    const [capacity, setCapacity] = useState("Any");
    const [sort, setSort] = useState("recommended");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const locations = useMemo(
        () =>
            Array.from(
                new Set(studios.map((studio) => studio.location)),
            ).sort(),
        [studios],
    );

    const results = useMemo(() => {
        const filtered = studios.filter((studio) => {
            const haystack =
                `${studio.title} ${studio.location} ${studio.category} ${studio.amenities.join(" ")}`.toLowerCase();
            return (
                haystack.includes(query.trim().toLowerCase()) &&
                (category === "All" || studio.category === category) &&
                (location === "All" || studio.location === location) &&
                studio.rate <= maxPrice &&
                (capacity === "Any" || studio.capacity >= Number(capacity))
            );
        });
        return filtered.sort((a, b) => {
            if (sort === "price-low") return a.rate - b.rate;
            if (sort === "price-high") return b.rate - a.rate;
            if (sort === "rating") return b.rating - a.rating;
            if (sort === "newest")
                return b.createdAt.localeCompare(a.createdAt);
            return (
                Number(b.featured) - Number(a.featured) || b.rating - a.rating
            );
        });
    }, [capacity, category, location, maxPrice, query, sort, studios]);

    const updateSearchParam = (key: string, value: string | null) => {
        const next = new URLSearchParams(searchParams?.toString() || "");
        if (!value || value === "All") next.delete(key);
        else next.set(key, value);
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname);
    };

    const reset = () => {
        setLocation("All");
        setMaxPrice(250);
        setCapacity("Any");
        setSort("recommended");
        router.replace(pathname);
    };

    const hasFilters =
        query ||
        category !== "All" ||
        location !== "All" ||
        maxPrice < 250 ||
        capacity !== "Any";

    return (
        <>
            <section className="relative overflow-hidden border-b border-line bg-[#1a1c17] text-white">
                <div className="absolute inset-y-0 right-0 hidden w-[38%] lg:block">
                    <img
                        src="/images/studio-cinema.jpg"
                        alt="Film crew working in a production studio"
                        className="h-full w-full object-cover opacity-55"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a1c17] to-transparent" />
                </div>
                <div className="container-shell relative py-16 sm:py-20 lg:py-24">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="eyebrow !text-[#d9ff63]"
                    >
                        The studio directory
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-5 max-w-3xl font-display text-[clamp(3.2rem,7vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.065em]"
                    >
                        Find your room
                        <br />
                        <span className="font-light italic text-[#d9ff63]">
                            to make.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 max-w-lg text-base leading-7 text-white/55"
                    >
                        Independent spaces, useful specifications, and clear
                        hourly rates. Search less. Make more.
                    </motion.p>
                </div>
            </section>

            <section className="container-shell section-space !pt-8 sm:!pt-10">
                <div className="rounded-[24px] border border-line bg-surface p-4 shadow-[0_12px_45px_rgba(25,30,18,.05)] sm:p-5">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="relative flex-1">
                            <Search size={18} className="field-icon" />
                            <label htmlFor="studio-search" className="sr-only">
                                Search studios
                            </label>
                            <input
                                id="studio-search"
                                value={query}
                                onChange={(event) =>
                                    updateSearchParam("q", event.target.value)
                                }
                                className="field !min-h-12 !pl-11"
                                placeholder="Search by name, city, or amenity…"
                            />
                        </div>
                        <div className="lg:w-60">
                            <Select
                                value={category}
                                onValueChange={(val) =>
                                updateSearchParam("category", val ?? "All")
                                }
                            >
                                <SelectTrigger
                                    className="!min-h-12"
                                    aria-label="Filter by category"
                                >
                                    <SelectValue placeholder="All studio types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">
                                        All studio types
                                    </SelectItem>
                                    {categories.map((item) => (
                                        <SelectItem
                                            key={item.name}
                                            value={item.name}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <button
                            type="button"
                            className="btn-secondary lg:hidden"
                            onClick={() => setFiltersOpen((open) => !open)}
                        >
                            <SlidersHorizontal size={17} />
                            {filtersOpen ? "Hide filters" : "More filters"}
                        </button>
                        <div className="lg:w-52">
                            <Select
                                value={sort}
                                onValueChange={(val) => setSort(val ?? "recommended")}
                            >
                                <SelectTrigger
                                    className="!min-h-12"
                                    aria-label="Sort studios"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recommended">
                                        Recommended
                                    </SelectItem>
                                    <SelectItem value="rating">
                                        Highest rated
                                    </SelectItem>
                                    <SelectItem value="newest">
                                        Newest spaces
                                    </SelectItem>
                                    <SelectItem value="price-low">
                                        Price: low to high
                                    </SelectItem>
                                    <SelectItem value="price-high">
                                        Price: high to low
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div
                        className={`${filtersOpen ? "grid" : "hidden"} mt-5 gap-5 border-t border-line pt-5 md:grid-cols-3 lg:grid`}
                    >
                        <div>
                            <p className="field-label">Location</p>
                            <Select
                                value={location}
                                onValueChange={(val) => setLocation(val ?? "All")}
                            >
                                <SelectTrigger aria-label="Filter by location">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">
                                        Any location
                                    </SelectItem>
                                    {locations.map((item) => (
                                        <SelectItem key={item} value={item}>
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <p className="field-label">Minimum capacity</p>
                            <Select
                                value={capacity}
                                onValueChange={(val) => setCapacity(val ?? "Any")}
                            >
                                <SelectTrigger aria-label="Filter by capacity">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Any">
                                        Any crew size
                                    </SelectItem>
                                    <SelectItem value="5">5+ people</SelectItem>
                                    <SelectItem value="10">
                                        10+ people
                                    </SelectItem>
                                    <SelectItem value="20">
                                        20+ people
                                    </SelectItem>
                                    <SelectItem value="35">
                                        35+ people
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <p className="field-label">
                                    Maximum hourly rate
                                </p>
                                <span className="text-xs font-semibold">
                                    {formatMoney(maxPrice)}
                                </span>
                            </div>
                            <Slider
                                className="mt-4"
                                min={45}
                                max={250}
                                step={5}
                                value={[maxPrice]}
                                onValueChange={(value) =>
                                    setMaxPrice(
                                        Array.isArray(value) ? Number(value[0]) : Number(value),
                                    )
                                }
                                aria-label="Maximum price filter"
                            />
                            <div className="mt-1 flex justify-between text-[10px] text-muted">
                                <span>$45</span>
                                <span>$250+</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-7 mt-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="font-display text-2xl font-semibold tracking-[-0.04em]">
                            {loading
                                ? "Opening the directory…"
                                : `${results.length} ${results.length === 1 ? "space" : "spaces"} to create in`}
                        </p>
                        {category !== "All" && (
                            <p className="mt-1 text-sm text-muted">
                                Showing {category.toLowerCase()} listings
                            </p>
                        )}
                    </div>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={reset}
                            className="btn-ghost !px-0 text-xs"
                        >
                            <RotateCcw size={14} />
                            Clear all filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <StudioCardSkeleton key={index} />
                        ))}
                    </div>
                ) : results.length ? (
                    <motion.div
                        layout
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {results.map((studio, index) => (
                                <StudioCard
                                    key={studio.id}
                                    studio={studio}
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div>
                        <EmptyState
                            title="No rooms match that setup"
                            description="Try a wider price range, another neighborhood, or a broader search. The right creative space may be one filter away."
                            actionLabel="Explore all studios"
                            actionTo="/studios"
                        />
                        <button
                            type="button"
                            onClick={reset}
                            className="btn-secondary mx-auto mt-5 flex"
                        >
                            <RotateCcw size={16} />
                            Reset search filters
                        </button>
                    </div>
                )}
            </section>
            <section className="border-t border-line bg-surface">
                <div className="container-shell flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
                    <div>
                        <p className="eyebrow">Have a space of your own?</p>
                        <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em]">
                            Put your empty hours to work.
                        </h2>
                    </div>
                    <Link href="/add-studio" className="btn-primary">
                        Become a host
                        <ArrowUpRight size={17} />
                    </Link>
                </div>
            </section>
        </>
    );
}
