"use client";

import {
    ArrowUpRight,
    CalendarDays,
    Clock3,
    Download,
    MapPin,
    NotebookTabs,
    Users,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../lib/AppContext";
import { downloadInvoice } from "../lib/invoice";
import type { Booking, BookingStatus } from "../types";
import { cn, formatDate, formatMoney, formatTime } from "../lib/utils";
import Image from "next/image";

const filters: Array<"All" | BookingStatus> = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
];

export default function MyBookings() {
    const { bookings, studios, user, cancelBooking } = useApp();
    const [filter, setFilter] = useState<(typeof filters)[number]>("All");
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
    const mine = useMemo(
        () =>
            bookings
                .filter((booking) => booking.userEmail === user?.email)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        [bookings, user],
    );
    const visible =
        filter === "All"
            ? mine
            : mine.filter((booking) => booking.status === filter);

    const confirmCancel = () => {
        if (!cancelTarget) return;
        const result = cancelBooking(cancelTarget.id);
        if (result.ok) toast.success(result.message);
        else toast.error(result.message);
    };

    return (
        <div className="container-shell section-space">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <p className="eyebrow">Your production calendar</p>
                    <h1 className="page-title mt-4">My bookings.</h1>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                        Every session, status, and receipt in one place. Pending
                        requests can be cancelled before host confirmation.
                    </p>
                </div>
                <Link href="/studios" className="btn-primary shrink-0">
                    Find another studio
                    <ArrowUpRight size={17} />
                </Link>
            </div>
            <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
                {filters.map((item) => {
                    const count =
                        item === "All"
                            ? mine.length
                            : mine.filter((booking) => booking.status === item)
                                  .length;
                    return (
                        <button
                            type="button"
                            key={item}
                            onClick={() => setFilter(item)}
                            className={cn(
                                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition",
                                filter === item
                                    ? "border-text bg-text text-bg"
                                    : "border-line bg-surface text-muted hover:text-text",
                            )}
                        >
                            {item}
                            <span
                                className={cn(
                                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px]",
                                    filter === item ? "bg-bg/15" : "bg-soft",
                                )}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="mt-8">
                {visible.length ? (
                    <div className="space-y-5">
                        {visible.map((booking) => {
                            const studio = studios.find(
                                (item) => item.id === booking.studioId,
                            );
                            if (!studio) return null;
                            return (
                                <article
                                    key={booking.id}
                                    className="overflow-hidden rounded-[24px] border border-line bg-surface"
                                >
                                    <div className="grid md:grid-cols-[210px_1fr]">
                                        <Link
                                            href={`/studios/${studio.id}`}
                                            className="relative min-h-48 overflow-hidden md:min-h-full"
                                        >
                                            <Image
                                                height={5000}
                                                width={8000}
                                                src={studio.images[0]}
                                                alt={studio.title}
                                                className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
                                            />
                                            <div className="absolute left-4 top-4">
                                                <StatusBadge
                                                    status={booking.status}
                                                />
                                            </div>
                                        </Link>
                                        <div className="p-5 sm:p-7">
                                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
                                                        {booking.id}
                                                    </p>
                                                    <Link
                                                        href={`/studios/${studio.id}`}
                                                        className="mt-2 block font-display text-2xl font-semibold tracking-[-0.045em] hover:text-[#779724]"
                                                    >
                                                        {studio.title}
                                                    </Link>
                                                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                                                        <MapPin size={13} />
                                                        {studio.location}
                                                    </p>
                                                </div>
                                                <div className="sm:text-right">
                                                    <p className="font-display text-2xl font-bold tracking-[-0.045em]">
                                                        {formatMoney(
                                                            booking.total,
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-muted">
                                                        Including refundable
                                                        deposit
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-6 grid gap-3 rounded-2xl bg-bg p-4 text-xs sm:grid-cols-3">
                                                <span className="flex items-center gap-2">
                                                    <CalendarDays
                                                        size={15}
                                                        className="text-[#7e9f2e]"
                                                    />
                                                    {formatDate(booking.date, {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock3
                                                        size={15}
                                                        className="text-[#7e9f2e]"
                                                    />
                                                    {formatTime(
                                                        booking.startTime,
                                                    )}{" "}
                                                    –{" "}
                                                    {formatTime(
                                                        booking.endTime,
                                                    )}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Users
                                                        size={15}
                                                        className="text-[#7e9f2e]"
                                                    />
                                                    {booking.guests}{" "}
                                                    {booking.guests === 1
                                                        ? "person"
                                                        : "people"}
                                                </span>
                                            </div>
                                            {booking.notes && (
                                                <p className="mt-4 line-clamp-1 text-xs italic text-muted">
                                                    Notes: {booking.notes}
                                                </p>
                                            )}
                                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                                                <p className="text-[10px] text-muted">
                                                    Requested{" "}
                                                    {formatDate(
                                                        booking.createdAt.slice(
                                                            0,
                                                            10,
                                                        ),
                                                    )}{" "}
                                                    · Hosted by{" "}
                                                    {studio.ownerName}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {(booking.status ===
                                                        "Confirmed" ||
                                                        booking.status ===
                                                            "Completed") && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                downloadInvoice(
                                                                    booking,
                                                                    studio,
                                                                );
                                                                toast.success(
                                                                    "Your PDF booking invoice has been downloaded.",
                                                                );
                                                            }}
                                                            className="btn-secondary min-h-9! px-4! text-xs"
                                                        >
                                                            <Download
                                                                size={14}
                                                            />
                                                            PDF invoice
                                                        </button>
                                                    )}
                                                    {booking.status ===
                                                        "Pending" && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setCancelTarget(
                                                                    booking,
                                                                )
                                                            }
                                                            className="btn-danger-subtle min-h-9! px-4! text-xs"
                                                        >
                                                            <X size={14} />
                                                            Cancel Booking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={<NotebookTabs size={28} />}
                        title={
                            filter === "All"
                                ? "Your production calendar is wide open"
                                : `No ${filter.toLowerCase()} bookings`
                        }
                        description={
                            filter === "All"
                                ? "Find a room that fits your idea, choose your hours, and your reservation will appear here with every useful detail."
                                : "Try another status filter, or explore the directory to plan your next creative session."
                        }
                        actionLabel="Explore creative spaces"
                        actionTo="/studios"
                    />
                )}
            </div>
            <ConfirmModal
                open={Boolean(cancelTarget)}
                onClose={() => setCancelTarget(null)}
                title="Cancel this booking request?"
                description={
                    cancelTarget
                        ? `Your pending request for ${formatDate(cancelTarget.date)} will be marked as cancelled. You can always request a new time later.`
                        : ""
                }
                confirmLabel="Cancel booking"
                onConfirm={confirmCancel}
            />
        </div>
    );
}
