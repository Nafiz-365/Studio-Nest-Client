"use client";

import {
    ArrowUpRight,
    CalendarClock,
    Clock3,
    MapPin,
    Users,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { useApp } from "@/lib/AppContext";
import type { Booking } from "@/types";
import { formatDate, formatMoney, formatTime } from "@/lib/utils";

type HostDecision = "confirm" | "decline";

export default function HostBookings() {
    const {
        hostBookings,
        hostBookingsError,
        isHostBookingsLoading,
        respondToBooking,
        studios,
    } = useApp();
    const [selectedRequest, setSelectedRequest] = useState<{
        booking: Booking;
        decision: HostDecision;
    } | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const pendingCount = hostBookings.filter(
        (booking) => booking.status === "Pending",
    ).length;

    const handleDecision = async () => {
        if (!selectedRequest) return;
        const { booking, decision } = selectedRequest;
        setProcessingId(booking.id);
        try {
            const result = await respondToBooking(booking.id, decision);
            if (!result.ok) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            setSelectedRequest(null);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="container-shell section-space">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <div>
                    <p className="eyebrow">Host workspace</p>
                    <h1 className="page-title mt-4">Booking requests.</h1>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                        Review reservations for your studios, then confirm or
                        decline each pending request.
                    </p>
                </div>
                <Link href="/my-listings" className="btn-secondary shrink-0">
                    Manage listings
                    <ArrowUpRight size={17} />
                </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4">
                <CalendarClock size={18} className="text-[#789b27]" />
                <p className="text-sm text-muted">
                    <strong className="text-text">{pendingCount}</strong>{" "}
                    pending {pendingCount === 1 ? "request" : "requests"} need
                    your review.
                </p>
            </div>

            <div className="mt-8">
                {isHostBookingsLoading ? (
                    <div className="space-y-4" aria-label="Loading requests">
                        {[0, 1, 2].map((item) => (
                            <div
                                key={item}
                                className="skeleton h-44 rounded-[24px]"
                            />
                        ))}
                    </div>
                ) : hostBookingsError ? (
                    <div
                        role="alert"
                        className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm"
                    >
                        <p className="font-semibold text-red-600">
                            Booking requests could not be loaded.
                        </p>
                        <p className="mt-2 text-muted">{hostBookingsError}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="btn-secondary mt-4"
                        >
                            Try again
                        </button>
                    </div>
                ) : hostBookings.length ? (
                    <div className="space-y-4">
                        {hostBookings.map((booking) => {
                            const studio = studios.find(
                                (item) => item.id === booking.studioId,
                            );
                            const isProcessing = processingId === booking.id;

                            return (
                                <article
                                    key={booking.id}
                                    className="rounded-[24px] border border-line bg-surface p-5 sm:p-7"
                                >
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <StatusBadge
                                                    status={booking.status}
                                                />
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                                                    {booking.id}
                                                </span>
                                            </div>
                                            <h2 className="mt-3 font-display text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                                                {studio?.title ||
                                                    booking.studioTitle ||
                                                    "Studio reservation"}
                                            </h2>
                                            {studio && (
                                                <Link
                                                    href={`/studios/${studio.id}`}
                                                    className="mt-1 inline-flex items-center gap-1 text-xs text-muted hover:text-text"
                                                >
                                                    <MapPin size={13} />
                                                    {studio.location}
                                                </Link>
                                            )}
                                            <p className="mt-3 text-sm font-medium">
                                                {booking.userName}
                                            </p>
                                            <p className="mt-1 break-all text-xs text-muted">
                                                {booking.userEmail}
                                            </p>
                                        </div>
                                        <div className="sm:text-right">
                                            <p className="font-display text-2xl font-bold tracking-[-0.04em]">
                                                {formatMoney(booking.total)}
                                            </p>
                                            <p className="mt-1 text-xs text-muted">
                                                {booking.hours}{" "}
                                                {booking.hours === 1
                                                    ? "hour"
                                                    : "hours"}{" "}
                                                · {booking.guests}{" "}
                                                {booking.guests === 1
                                                    ? "guest"
                                                    : "guests"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-3 rounded-2xl bg-bg p-4 sm:grid-cols-3">
                                        <p className="flex items-center gap-2 text-sm">
                                            <CalendarClock
                                                size={16}
                                                className="text-muted"
                                            />
                                            {formatDate(booking.date)}
                                        </p>
                                        <p className="flex items-center gap-2 text-sm">
                                            <Clock3
                                                size={16}
                                                className="text-muted"
                                            />
                                            {formatTime(booking.startTime)} –{" "}
                                            {formatTime(booking.endTime)}
                                        </p>
                                        <p className="flex items-center gap-2 text-sm">
                                            <Users
                                                size={16}
                                                className="text-muted"
                                            />
                                            {booking.guests} attending
                                        </p>
                                    </div>

                                    {booking.notes?.trim() && (
                                        <div className="mt-4">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
                                                Creator notes
                                            </p>
                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                                                {booking.notes}
                                            </p>
                                        </div>
                                    )}

                                    {booking.status === "Pending" && (
                                        <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-line pt-5">
                                            <button
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    setSelectedRequest({
                                                        booking,
                                                        decision: "decline",
                                                    })
                                                }
                                                className="btn-secondary disabled:opacity-60"
                                            >
                                                Decline request
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    setSelectedRequest({
                                                        booking,
                                                        decision: "confirm",
                                                    })
                                                }
                                                className="btn-primary disabled:opacity-60"
                                            >
                                                Confirm booking
                                            </button>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={<CalendarClock size={28} />}
                        title="No booking requests yet"
                        description="When a creator requests one of your studios, you’ll find their schedule and production notes here."
                        actionLabel="View my listings"
                        actionTo="/my-listings"
                    />
                )}
            </div>

            <ConfirmModal
                open={Boolean(selectedRequest)}
                onClose={() => {
                    if (!processingId) setSelectedRequest(null);
                }}
                title={
                    selectedRequest?.decision === "confirm"
                        ? "Confirm this booking?"
                        : "Decline this request?"
                }
                description={
                    selectedRequest
                        ? `${selectedRequest.decision === "confirm" ? "Confirm" : "Decline"} the request for ${selectedRequest.booking.userName} on ${formatDate(selectedRequest.booking.date)} from ${formatTime(selectedRequest.booking.startTime)} to ${formatTime(selectedRequest.booking.endTime)}?`
                        : ""
                }
                confirmLabel={
                    processingId
                        ? "Updating…"
                        : selectedRequest?.decision === "confirm"
                          ? "Confirm booking"
                          : "Decline request"
                }
                onConfirm={handleDecision}
            />
        </div>
    );
}
