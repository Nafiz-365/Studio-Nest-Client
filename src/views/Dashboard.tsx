"use client";

import {
    ArrowRight,
    ArrowUpRight,
    Bookmark,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Heart,
    Plus,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "../lib/AppContext";
import { Avatar } from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { formatDate, formatMoney, formatTime, toDateInput } from "../lib/utils";
import Image from "next/image";

export default function Dashboard() {
    const { user, studios, bookings, wishlist } = useApp();
    const myBookings = bookings.filter(
        (booking) => booking.userEmail === user?.email,
    );
    const myListings = studios.filter(
        (studio) => studio.ownerEmail === user?.email,
    );
    const upcoming = myBookings
        .filter(
            (booking) =>
                booking.date >= toDateInput(new Date()) &&
                ["Pending", "Confirmed"].includes(booking.status),
        )
        .sort((a, b) => a.date.localeCompare(b.date));
    const confirmed = myBookings.filter(
        (booking) => booking.status === "Confirmed",
    );
    const stats = [
        {
            label: "Upcoming sessions",
            value: upcoming.length,
            icon: CalendarDays,
            to: "/my-bookings",
        },
        {
            label: "Studio listings",
            value: myListings.length,
            icon: Building2,
            to: "/my-listings",
        },
        {
            label: "Saved spaces",
            value: wishlist.length,
            icon: Heart,
            to: "/wishlist",
        },
        {
            label: "Confirmed bookings",
            value: confirmed.length,
            icon: CheckCircle2,
            to: "/my-bookings",
        },
    ];

    return (
        <div className="container-shell section-space">
            <section className="relative overflow-hidden rounded-[30px] bg-[#1a1c17] px-6 py-10 text-white sm:px-10 sm:py-12">
                <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-[#d9ff63]/15" />
                <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-[#d9ff63]/10" />
                <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                    <div>
                        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9ff63]">
                            <Sparkles size={14} />
                            Your creative headquarters
                        </p>
                        <h1 className="mt-4 font-display text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-none tracking-[-0.06em]">
                            Good to see you,
                            <br />
                            {user?.name.split(" ")[0]}.
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
                            Everything you’re making, booking, and sharing—ready
                            when you are.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <Avatar
                            name={user?.name ?? "Creator"}
                            photoURL={user?.photoURL}
                            className="h-16 w-16 text-lg! ring-4 ring-white/10"
                        />
                        <Link href="/studios" className="btn-light">
                            Find a space
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07 }}
                    >
                        <Link
                            href={stat.to}
                            className="group block h-full rounded-[22px] border border-line bg-surface p-5 transition hover:-translate-y-1 hover:border-[#a9c95a] sm:p-6"
                        >
                            <div className="flex items-center justify-between">
                                <stat.icon
                                    size={20}
                                    className="text-[#7c9e2b]"
                                    strokeWidth={1.7}
                                />
                                <ArrowUpRight
                                    size={15}
                                    className="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </div>
                            <p className="mt-7 font-display text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted sm:text-xs">
                                {stat.label}
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </section>

            <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.45fr_.75fr]">
                <section>
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <p className="eyebrow">On the horizon</p>
                            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tighter">
                                Upcoming sessions
                            </h2>
                        </div>
                        <Link
                            href="/my-bookings"
                            className="hidden items-center gap-2 text-xs font-semibold text-muted hover:text-text sm:flex"
                        >
                            View all
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                    {upcoming.length ? (
                        <div className="space-y-4">
                            {upcoming.slice(0, 3).map((booking) => {
                                const studio = studios.find(
                                    (item) => item.id === booking.studioId,
                                );
                                if (!studio) return null;
                                return (
                                    <Link
                                        href="/my-bookings"
                                        key={booking.id}
                                        className="group grid gap-4 rounded-[22px] border border-line bg-surface p-4 transition hover:border-[#a6c75a] sm:grid-cols-[100px_1fr_auto] sm:items-center"
                                    >
                                        <Image
                                            height={5000}
                                            width={8000}
                                            src={studio.images[0]}
                                            alt=""
                                            className="h-32 w-full rounded-2xl object-cover sm:h-25"
                                        />
                                        <div>
                                            <StatusBadge
                                                status={booking.status}
                                            />
                                            <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.035em]">
                                                {studio.title}
                                            </h3>
                                            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarDays size={13} />
                                                    {formatDate(booking.date, {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock3 size={13} />
                                                    {formatTime(
                                                        booking.startTime,
                                                    )}{" "}
                                                    –{" "}
                                                    {formatTime(
                                                        booking.endTime,
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-line pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                                            <p className="font-display text-lg font-semibold">
                                                {formatMoney(booking.total)}
                                            </p>
                                            <ArrowUpRight
                                                size={17}
                                                className="text-muted transition group-hover:translate-x-1 sm:ml-auto sm:mt-4"
                                            />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            title="No sessions on the horizon"
                            description="Your next booking will appear here. Explore the directory and find a room for whatever you’re planning."
                            actionLabel="Explore studios"
                            actionTo="/studios"
                        />
                    )}
                </section>
                <aside className="space-y-5">
                    <div className="rounded-[24px] border border-line bg-surface p-6">
                        <p className="eyebrow">Quick actions</p>
                        <div className="mt-5 space-y-2">
                            {[
                                {
                                    to: "/add-studio",
                                    icon: Plus,
                                    label: "List a new studio",
                                    note: "Share your empty hours",
                                },
                                {
                                    to: "/my-listings",
                                    icon: Building2,
                                    label: "Manage listings",
                                    note: "Update details and rates",
                                },
                                {
                                    to: "/wishlist",
                                    icon: Bookmark,
                                    label: "Open your shortlist",
                                    note: `${wishlist.length} saved ${wishlist.length === 1 ? "space" : "spaces"}`,
                                },
                            ].map((action) => (
                                <Link
                                    key={action.to}
                                    href={action.to}
                                    className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-soft"
                                >
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-[#789a29] transition group-hover:bg-[#d9ff63] group-hover:text-[#171915]">
                                        <action.icon size={17} />
                                    </span>
                                    <span>
                                        <span className="block text-xs font-semibold">
                                            {action.label}
                                        </span>
                                        <span className="mt-1 block text-[10px] text-muted">
                                            {action.note}
                                        </span>
                                    </span>
                                    <ArrowRight
                                        size={14}
                                        className="ml-auto text-muted transition group-hover:translate-x-1"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-[24px] bg-[#d9ff63] p-6 text-[#1a1c17]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
                            A better production day
                        </p>
                        <p className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.045em]">
                            Confirm load-in before you load the car.
                        </p>
                        <p className="mt-3 text-xs leading-5 text-[#1a1c17]/65">
                            Check access, parking, and equipment with your host
                            24 hours before call time. Future you will be
                            grateful.
                        </p>
                        <Link
                            href="/how-it-works"
                            className="mt-5 inline-flex items-center gap-2 text-xs font-bold underline underline-offset-4"
                        >
                            Read the creator checklist
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
