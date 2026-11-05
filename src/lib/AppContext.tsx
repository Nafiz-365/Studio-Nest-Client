"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { authClient } from "./auth-client";
import { createSeedBookings, seedStudios } from "../data/studios";
import type {
    ActionResult,
    Booking,
    BookingInput,
    Studio,
    StudioDraft,
    User,
} from "../types";
import { calculateHours, createId, getCurrentDate, toDateInput } from "./utils";

const STORAGE = {
    studios: "studionest.studios.v1",
    bookings: "studionest.bookings.v1",
    wishlist: "studionest.wishlist.v1",
    theme: "studionest.theme.v1",
};

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function readStorage<T>(key: string, fallback: T): T {
    try {
        if (typeof window === "undefined") return fallback;
        const value = localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
    } catch {
        return fallback;
    }
}

async function apiRequest(url: string, init: RequestInit) {
    const backendUrl = new URL(url, API_BASE_URL);
    const proxyUrl = `/api/backend${backendUrl.pathname}${backendUrl.search}`;
    const headers = new Headers(init.headers);
    headers.delete("Authorization");
    headers.delete("x-user-email");

    const response = await fetch(proxyUrl, {
        ...init,
        headers,
        credentials: "same-origin",
    });
    if (!response.ok) {
        const body = await response.text();
        let message = body;
        try {
            const parsed = JSON.parse(body) as {
                error?: string;
                message?: string;
            };
            message = parsed.error || parsed.message || body;
        } catch {
            // Keep the backend's plain-text response as the visible error.
        }
        throw new Error(
            message || `API request failed with status ${response.status}`,
        );
    }
    return response;
}

interface AppContextValue {
    studios: Studio[];
    bookings: Booking[];
    hostBookings: Booking[];
    isHostBookingsLoading: boolean;
    hostBookingsError: string | null;
    user: User | null;
    theme: "light" | "dark";
    wishlist: string[];
    isHydrated: boolean;
    isAuthPending: boolean;
    toggleTheme: () => void;
    login: (email: string, password: string) => Promise<ActionResult>;
    register: (
        name: string,
        email: string,
        photoURL: string,
        password: string,
    ) => Promise<ActionResult>;
    logout: () => void;
    addStudio: (draft: StudioDraft) => Promise<ActionResult>;
    updateStudio: (id: string, draft: StudioDraft) => Promise<ActionResult>;
    deleteStudio: (id: string) => Promise<ActionResult>;
    addBooking: (input: BookingInput) => Promise<ActionResult>;
    cancelBooking: (id: string) => Promise<ActionResult>;
    refreshMyBookings: () => Promise<void>;
    respondToBooking: (
        id: string,
        decision: "confirm" | "decline",
    ) => Promise<ActionResult>;
    toggleWishlist: (studioId: string) => Promise<ActionResult>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [studios, setStudios] = useState<Studio[]>(seedStudios);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [hostBookings, setHostBookings] = useState<Booking[]>([]);
    const [isHostBookingsLoading, setIsHostBookingsLoading] = useState(false);
    const [hostBookingsError, setHostBookingsError] = useState<string | null>(
        null,
    );
    const [user, setUser] = useState<User | null>(null);
    const [wishlistMap, setWishlistMap] = useState<Record<string, string[]>>(
        {},
    );
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const { data: authSession, isPending: authPending } =
        authClient.useSession();

    useEffect(() => {
        const sessionUser = authSession?.user;
        const timer = window.setTimeout(() => {
            if (sessionUser) {
                setUser({
                    name: sessionUser.name,
                    email: sessionUser.email,
                    photoURL: sessionUser.image ?? "",
                });
            } else if (authSession === null) {
                setUser(null);
            }
        }, 0);
        return () => window.clearTimeout(timer);
    }, [authSession]);

    useEffect(() => {
        try {
            const savedStudios = readStorage<Studio[] | null>(
                STORAGE.studios,
                null,
            );
            if (
                savedStudios &&
                Array.isArray(savedStudios) &&
                savedStudios.length
            )
                setStudios(savedStudios);

            const savedBookings = readStorage<Booking[] | null>(
                STORAGE.bookings,
                null,
            );
            if (savedBookings && Array.isArray(savedBookings))
                setBookings(savedBookings);
            else setBookings(createSeedBookings());

            const savedWishlist = readStorage<Record<string, string[]> | null>(
                STORAGE.wishlist,
                null,
            );
            if (savedWishlist) setWishlistMap(savedWishlist);

            const savedTheme = readStorage<"light" | "dark" | null>(
                STORAGE.theme,
                null,
            );
            if (savedTheme) {
                setTheme(savedTheme);
            } else if (
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                setTheme("dark");
            }
        } finally {
            setIsHydrated(true);
        }

        // Connect to Express + MongoDB backend if available
        fetch(`${API_BASE_URL}/studios`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const formatted = data.map(
                        (item: Studio & { _id?: string }) => ({
                            ...item,
                            id:
                                item.id ||
                                (item._id
                                    ? String(item._id)
                                    : createId("studio")),
                        }),
                    );
                    setStudios(formatted);
                }
            })
            .catch(() => {
                // Graceful fallback to persistent seed storage
            });
    }, []);

    useEffect(() => {
        const email = authSession?.user?.email;
        let ignore = false;
        if (!email) {
            void Promise.resolve().then(() => {
                if (ignore) return;
                setHostBookings([]);
                setHostBookingsError(null);
                setIsHostBookingsLoading(false);
            });
            return () => {
                ignore = true;
            };
        }

        void Promise.resolve().then(() => {
            if (ignore) return;
            setIsHostBookingsLoading(true);
            setHostBookingsError(null);
        });
        apiRequest(`${API_BASE_URL}/host-bookings`, {})
            .then((response) => response.json())
            .then((data: unknown) => {
                if (!Array.isArray(data)) {
                    throw new Error(
                        "The host booking API returned an invalid response.",
                    );
                }
                if (!ignore) {
                    setHostBookings(
                        data.map(
                            (
                                item: Booking & {
                                    _id?: string;
                                    cancellationReason?: string;
                                },
                            ) => ({
                                ...item,
                                id:
                                    item.id ||
                                    (item._id
                                        ? String(item._id)
                                        : createId("booking")),
                                status:
                                    item.status === "Cancelled" &&
                                    item.cancellationReason ===
                                        "Declined by host"
                                        ? "Declined"
                                        : item.status,
                            }),
                        ),
                    );
                }
            })
            .catch((error: unknown) => {
                if (!ignore) {
                    console.error(
                        "Failed to load host booking requests.",
                        error,
                    );
                    setHostBookings([]);
                    setHostBookingsError(
                        error instanceof Error
                            ? error.message
                            : "Booking requests could not be loaded.",
                    );
                }
            })
            .finally(() => {
                if (!ignore) setIsHostBookingsLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [authSession?.user?.email]);

    useEffect(() => {
        const email = authSession?.user?.email;
        if (!email) return;

        const loadAccountData = async () => {
            try {
                const [listingResponse, bookingResponse, wishlistResponse] =
                    await Promise.all([
                        apiRequest(
                            `${API_BASE_URL}/my-studios/${encodeURIComponent(email)}`,
                            {},
                        ),
                        apiRequest(
                            `${API_BASE_URL}/my-bookings/${encodeURIComponent(email)}`,
                            {},
                        ),
                        apiRequest(
                            `${API_BASE_URL}/wishlist/${encodeURIComponent(email)}`,
                            {},
                        ),
                    ]);

                const listings = await listingResponse.json();
                if (Array.isArray(listings)) {
                    setStudios((current) => {
                        const serverListings = listings.map(
                            (item: Studio & { _id?: string }) => ({
                                ...item,
                                id:
                                    item.id ||
                                    (item._id
                                        ? String(item._id)
                                        : createId("studio")),
                            }),
                        );
                        const listingIds = new Set(
                            serverListings.map((item) => item.id),
                        );
                        return [
                            ...serverListings,
                            ...current.filter(
                                (item) =>
                                    item.ownerEmail !== email ||
                                    !listingIds.has(item.id),
                            ),
                        ];
                    });
                }

                const accountBookings = await bookingResponse.json();
                if (Array.isArray(accountBookings)) {
                    setBookings(
                        accountBookings.map(
                            (
                                item: Booking & {
                                    _id?: string;
                                    cancellationReason?: string;
                                },
                            ) => ({
                                ...item,
                                id:
                                    item.id ||
                                    (item._id
                                        ? String(item._id)
                                        : createId("booking")),
                                status:
                                    item.status === "Cancelled" &&
                                    item.cancellationReason ===
                                        "Declined by host"
                                        ? "Declined"
                                        : item.status,
                            }),
                        ),
                    );
                }

                if (wishlistResponse.ok) {
                    const wishlistData = await wishlistResponse.json();
                    if (Array.isArray(wishlistData?.wishlist)) {
                        setWishlistMap((current) => ({
                            ...current,
                            [email]: wishlistData.wishlist,
                        }));
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to load account data from the API.",
                    error,
                );
                setStudios((current) =>
                    current.filter((item) => item.ownerEmail !== email),
                );
                setBookings([]);
                setWishlistMap((current) => {
                    const next = { ...current };
                    delete next[email];
                    return next;
                });
            }
        };

        void loadAccountData();
    }, [authSession?.user?.email]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.style.colorScheme = theme;
        if (isHydrated) {
            localStorage.setItem(STORAGE.theme, JSON.stringify(theme));
        }
    }, [theme, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(STORAGE.studios, JSON.stringify(studios));
        } catch {
            // Ignore persistence failures.
        }
    }, [studios, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(STORAGE.bookings, JSON.stringify(bookings));
        } catch {
            // Ignore persistence failures.
        }
    }, [bookings, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(STORAGE.wishlist, JSON.stringify(wishlistMap));
        } catch {
            // Ignore persistence failures.
        }
    }, [wishlistMap, isHydrated]);

    const wishlist = useMemo(
        () => (user ? (wishlistMap[user.email] ?? []) : []),
        [user, wishlistMap],
    );

    const value = useMemo<AppContextValue>(
        () => ({
            studios,
            bookings,
            hostBookings,
            isHostBookingsLoading,
            hostBookingsError,
            user,
            theme,
            wishlist,
            isHydrated,
            isAuthPending: authPending,
            toggleTheme: () =>
                setTheme((current) => (current === "light" ? "dark" : "light")),
            login: async (email, password) => {
                const { data, error } = await authClient.signIn.email({
                    email: email.trim().toLowerCase(),
                    password,
                });
                if (error || !data?.user) {
                    return {
                        ok: false,
                        message:
                            error?.message ??
                            "Unable to log in with those credentials.",
                    };
                }
                return {
                    ok: true,
                    message: `Welcome back, ${data.user.name.split(" ")[0]}.`,
                };
            },
            register: async (name, email, photoURL, password) => {
                const { data, error } = await authClient.signUp.email({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    image: photoURL.trim() || undefined,
                });
                if (error || !data?.user) {
                    return {
                        ok: false,
                        message:
                            error?.message ?? "Unable to create your account.",
                    };
                }
                return {
                    ok: true,
                    message:
                        "Your StudioNest account is ready. You are now signed in.",
                };
            },
            logout: () => {
                void authClient.signOut();
                setUser(null);
            },
            addStudio: async (draft) => {
                if (!user)
                    return {
                        ok: false,
                        message:
                            "Your session is not authorized. Please log in again.",
                    };
                const studio: Studio = {
                    ...draft,
                    id: createId("studio"),
                    ownerEmail: user.email,
                    ownerName: user.name,
                    rating: 0,
                    reviewsCount: 0,
                    reviews: [],
                    createdAt: toDateInput(getCurrentDate()),
                    featured: false,
                    hostSince: String(getCurrentDate().getFullYear()),
                    responseTime: "New host · typically replies within a day",
                };
                try {
                    const response = await apiRequest(
                        `${API_BASE_URL}/add-studio`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(studio),
                        },
                    );
                    const data = (await response.json()) as {
                        studio?: Studio & { _id?: string };
                    };
                    const savedStudio = data.studio
                        ? {
                              ...data.studio,
                              id:
                                  data.studio.id ||
                                  (data.studio._id
                                      ? String(data.studio._id)
                                      : studio.id),
                          }
                        : studio;
                    setStudios((current) => [savedStudio, ...current]);
                } catch (error) {
                    console.error("Failed to create studio on the API.", error);
                    return {
                        ok: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "The studio could not be created. Please try again.",
                    };
                }
                return {
                    ok: true,
                    message: "Your studio is live and ready for discovery.",
                    id: studio.id,
                };
            },
            updateStudio: async (id, draft) => {
                if (!user)
                    return {
                        ok: false,
                        message:
                            "Your session is not authorized. Please log in again.",
                    };
                const existing = studios.find((studio) => studio.id === id);
                if (!existing)
                    return {
                        ok: false,
                        message: "This studio could not be found.",
                    };
                if (existing.ownerEmail !== user.email) {
                    return {
                        ok: false,
                        message: "Only the listing owner can edit this studio.",
                    };
                }
                try {
                    await apiRequest(`${API_BASE_URL}/studio/${id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(draft),
                    });
                } catch (error) {
                    console.error("Failed to update studio on the API.", error);
                    return {
                        ok: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "The studio could not be updated. Please try again.",
                    };
                }
                setStudios((current) =>
                    current.map((studio) =>
                        studio.id === id ? { ...studio, ...draft } : studio,
                    ),
                );
                return {
                    ok: true,
                    message: "Studio details updated successfully.",
                    id,
                };
            },
            deleteStudio: async (id) => {
                if (!user)
                    return {
                        ok: false,
                        message:
                            "Your session is not authorized. Please log in again.",
                    };
                const existing = studios.find((studio) => studio.id === id);
                if (!existing)
                    return {
                        ok: false,
                        message: "This studio has already been removed.",
                    };
                if (existing.ownerEmail !== user.email) {
                    return {
                        ok: false,
                        message:
                            "Only the listing owner can delete this studio.",
                    };
                }
                try {
                    await apiRequest(`${API_BASE_URL}/studio/${id}`, {
                        method: "DELETE",
                    });
                } catch (error) {
                    console.error("Failed to delete studio on the API.", error);
                    return {
                        ok: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "The studio could not be deleted. Please try again.",
                    };
                }

                setStudios((current) =>
                    current.filter((studio) => studio.id !== id),
                );
                setBookings((current) =>
                    current.filter((booking) => booking.studioId !== id),
                );
                return {
                    ok: true,
                    message: `${existing.title} has been removed.`,
                };
            },
            addBooking: async (input) => {
                if (!user)
                    return {
                        ok: false,
                        message: "Please log in before reserving a workspace.",
                    };
                const studio = studios.find(
                    (item) => item.id === input.studioId,
                );
                if (!studio)
                    return {
                        ok: false,
                        message: "This studio is no longer available.",
                    };
                const hours = calculateHours(input.startTime, input.endTime);
                if (hours < 1)
                    return {
                        ok: false,
                        message:
                            "Choose an end time at least one hour after your start time.",
                    };
                if (input.date < toDateInput(getCurrentDate()))
                    return {
                        ok: false,
                        message:
                            "Choose today or a future date for your session.",
                    };
                if (input.guests < 1 || input.guests > studio.capacity) {
                    return {
                        ok: false,
                        message: `This studio accommodates between 1 and ${studio.capacity} people.`,
                    };
                }
                const start = Date.parse(`${input.date}T${input.startTime}:00`);
                const end = Date.parse(`${input.date}T${input.endTime}:00`);
                const collision = bookings.find((booking) => {
                    if (
                        booking.studioId !== input.studioId ||
                        booking.date !== input.date ||
                        !["Confirmed", "Pending"].includes(booking.status)
                    )
                        return false;
                    const bookedStart = Date.parse(
                        `${booking.date}T${booking.startTime}:00`,
                    );
                    const bookedEnd = Date.parse(
                        `${booking.date}T${booking.endTime}:00`,
                    );
                    return start < bookedEnd && end > bookedStart;
                });
                if (collision) {
                    return {
                        ok: false,
                        message: `That time overlaps a confirmed reservation from ${collision.startTime} to ${collision.endTime}. Please choose different hours.`,
                    };
                }
                const subtotal = hours * studio.rate;
                const serviceFee = Math.round(subtotal * 0.08);
                const id = createId("booking");
                const booking: Booking = {
                    ...input,
                    id,
                    userEmail: user.email,
                    userName: user.name,
                    hours,
                    subtotal,
                    serviceFee,
                    deposit: studio.deposit,
                    total: subtotal + serviceFee + studio.deposit,
                    status: "Pending",
                    createdAt: getCurrentDate().toISOString(),
                };
                try {
                    const response = await apiRequest(
                        `${API_BASE_URL}/booking`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                ...booking,
                                studioTitle: studio.title,
                            }),
                        },
                    );
                    const data = (await response.json()) as {
                        booking?: Booking & { _id?: string };
                    };
                    const savedBooking = data.booking
                        ? {
                              ...data.booking,
                              id:
                                  data.booking.id ||
                                  (data.booking._id
                                      ? String(data.booking._id)
                                      : booking.id),
                          }
                        : booking;
                    setBookings((current) => [savedBooking, ...current]);
                } catch (error) {
                    console.error(
                        "Failed to create booking on the API.",
                        error,
                    );
                    return {
                        ok: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "The booking could not be created. Please try again.",
                    };
                }
                return {
                    ok: true,
                    message:
                        "Reservation requested. The host will review your pending booking.",
                    id,
                };
            },
            cancelBooking: async (id) => {
                if (!user)
                    return {
                        ok: false,
                        message: "Please log in to manage this reservation.",
                    };
                const booking = bookings.find((item) => item.id === id);
                if (!booking || booking.userEmail !== user.email)
                    return {
                        ok: false,
                        message: "This reservation could not be found.",
                    };
                if (booking.status !== "Pending")
                    return {
                        ok: false,
                        message:
                            "Only pending reservations can be cancelled here.",
                    };
                try {
                    await apiRequest(`${API_BASE_URL}/booking/${id}/cancel`, {
                        method: "PATCH",
                    });
                } catch (error) {
                    console.error(
                        "Failed to cancel booking on the API.",
                        error,
                    );
                    return {
                        ok: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "The booking could not be cancelled. Please try again.",
                    };
                }
                setBookings((current) =>
                    current.map((item) =>
                        item.id === id
                            ? { ...item, status: "Cancelled" as const }
                            : item,
                    ),
                );
                return {
                    ok: true,
                    message: "Your booking request has been cancelled.",
                };
            },
            refreshMyBookings: async () => {
                const email = authSession?.user?.email;
                if (!email) return;

                try {
                    const response = await apiRequest(
                        `${API_BASE_URL}/my-bookings/${encodeURIComponent(email)}`,
                        {},
                    );
                    const accountBookings = (await response.json()) as unknown;
                    if (!Array.isArray(accountBookings)) {
                        throw new Error(
                            "The bookings API returned an invalid response.",
                        );
                    }

                    const refreshedBookings = accountBookings.map(
                        (
                            item: Booking & {
                                _id?: string;
                                cancellationReason?: string;
                            },
                        ) => ({
                            ...item,
                            id:
                                item.id ||
                                (item._id
                                    ? String(item._id)
                                    : createId("booking")),
                            status:
                                item.status === "Cancelled" &&
                                item.cancellationReason === "Declined by host"
                                    ? "Declined"
                                    : item.status,
                        }),
                    );
                    setBookings((current) => {
                        const otherBookings = current.filter(
                            (item) =>
                                item.userEmail?.toLowerCase() !==
                                email.toLowerCase(),
                        );
                        const currentById = new Map(
                            current
                                .filter(
                                    (item) =>
                                        item.userEmail?.toLowerCase() ===
                                        email.toLowerCase(),
                                )
                                .map((item) => [item.id, item]),
                        );
                        const hasChanges =
                            currentById.size !== refreshedBookings.length ||
                            refreshedBookings.some((item) => {
                                const existing = currentById.get(item.id);
                                return (
                                    !existing ||
                                    existing.status !== item.status ||
                                    existing.createdAt !== item.createdAt
                                );
                            });

                        return hasChanges
                            ? [...otherBookings, ...refreshedBookings]
                            : current;
                    });
                } catch (error) {
                    console.error("Failed to refresh account bookings.", error);
                }
            },
            respondToBooking: async (id, decision) => {
                const booking = hostBookings.find((item) => item.id === id);
                if (!booking || booking.status !== "Pending") {
                    return {
                        ok: false,
                        message:
                            "This pending booking request could not be found.",
                    };
                }

                try {
                    const response = await apiRequest(
                        `${API_BASE_URL}/booking/${encodeURIComponent(id)}/host-decision`,
                        {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ decision }),
                        },
                    );
                    const data = (await response.json()) as {
                        status?: Booking["status"];
                        message?: string;
                    };
                    if (
                        data.status !== "Confirmed" &&
                        data.status !== "Declined"
                    ) {
                        throw new Error(
                            "The booking API returned an invalid decision status.",
                        );
                    }
                    const updatedStatus = data.status;
                    setHostBookings((current) =>
                        current.map((item) =>
                            item.id === id
                                ? { ...item, status: updatedStatus }
                                : item,
                        ),
                    );
                    setBookings((current) =>
                        current.map((item) =>
                            item.id === id
                                ? { ...item, status: updatedStatus }
                                : item,
                        ),
                    );
                    return {
                        ok: true,
                        message:
                            data.message ||
                            (decision === "confirm"
                                ? "Booking request confirmed."
                                : "Booking request declined."),
                    };
                } catch (error) {
                    console.error(
                        "Failed to respond to booking request.",
                        error,
                    );
                    return {
                        ok: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "The booking request could not be updated.",
                    };
                }
            },
            toggleWishlist: async (studioId) => {
                if (!user)
                    return {
                        ok: false,
                        message: "Log in to save studios to your wishlist.",
                    };
                const exists = (wishlistMap[user.email] ?? []).includes(
                    studioId,
                );
                try {
                    const response = await apiRequest(
                        `${API_BASE_URL}/wishlist`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: user.email,
                                studioId,
                                saved: !exists,
                            }),
                        },
                    );
                    const data = (await response.json()) as {
                        wishlist?: string[];
                        saved?: boolean;
                    };
                    const updatedWishlist = data.wishlist;
                    if (
                        !Array.isArray(updatedWishlist) ||
                        typeof data.saved !== "boolean"
                    ) {
                        throw new Error(
                            "The wishlist API returned an invalid response.",
                        );
                    }
                    setWishlistMap((current) => ({
                        ...current,
                        [user.email]: updatedWishlist,
                    }));
                    return {
                        ok: true,
                        message: data.saved
                            ? "Saved to your creative shortlist."
                            : "Removed from your saved studios.",
                    };
                } catch (error) {
                    console.error(
                        "Failed to update wishlist on the API.",
                        error,
                    );
                    return {
                        ok: false,
                        message:
                            error instanceof Error
                                ? error.message
                                : "The wishlist could not be updated. Please try again.",
                    };
                }
            },
        }),
        [
            bookings,
            hostBookings,
            isHostBookingsLoading,
            hostBookingsError,
            setBookings,
            setStudios,
            setUser,
            setWishlistMap,
            studios,
            theme,
            user,
            wishlist,
            wishlistMap,
            isHydrated,
            authPending,
            authSession?.user?.email,
        ],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used inside AppProvider");
    return context;
}
