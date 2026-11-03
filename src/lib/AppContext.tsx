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
import { getTokenFromClient } from "./getTokenFromClient";

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

async function apiRequest(
    url: string,
    init: RequestInit,
    email?: string,
) {
    const token = await getTokenFromClient();
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (email) headers.set("x-user-email", email);

    const response = await fetch(url, { ...init, headers });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `API request failed with status ${response.status}`);
    }
    return response;
}

interface AppContextValue {
    studios: Studio[];
    bookings: Booking[];
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
    addStudio: (draft: StudioDraft) => ActionResult;
    updateStudio: (id: string, draft: StudioDraft) => ActionResult;
    deleteStudio: (id: string) => ActionResult;
    addBooking: (input: BookingInput) => ActionResult;
    cancelBooking: (id: string) => ActionResult;
    toggleWishlist: (studioId: string) => ActionResult;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [studios, setStudios] = useState<Studio[]>(seedStudios);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [wishlistMap, setWishlistMap] = useState<Record<string, string[]>>(
        {},
    );
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const { data: authSession, isPending: authPending } = authClient.useSession();

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
        if (!email) return;

        const loadAccountData = async () => {
            try {
                const [listingResponse, bookingResponse, wishlistResponse] =
                    await Promise.all([
                        apiRequest(
                            `${API_BASE_URL}/my-studios/${encodeURIComponent(email)}`,
                            {},
                            email,
                        ),
                        apiRequest(
                            `${API_BASE_URL}/my-bookings/${encodeURIComponent(email)}`,
                            {},
                            email,
                        ),
                        fetch(
                            `${API_BASE_URL}/wishlist/${encodeURIComponent(email)}`,
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
                            (item: Booking & { _id?: string }) => ({
                                ...item,
                                id:
                                    item.id ||
                                    (item._id
                                        ? String(item._id)
                                        : createId("booking")),
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
                console.error("Failed to load account data from the API.", error);
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
                        message: error?.message ?? "Unable to log in with those credentials.",
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
                        message: error?.message ?? "Unable to create your account.",
                    };
                }
                return {
                    ok: true,
                    message: "Your StudioNest account is ready. You are now signed in.",
                };
            },
            logout: () => {
                void authClient.signOut();
                setUser(null);
            },
            addStudio: (draft) => {
                if (!user)
                    return {
                        ok: false,
                        message:
                            "Your session is not authorized. Please log in again.",
                    };
                const id = createId("studio");
                const studio: Studio = {
                    ...draft,
                    id,
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
                setStudios((current) => [studio, ...current]);
                apiRequest(`${API_BASE_URL}/add-studio`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(studio),
                }, user.email).catch((error: unknown) => {
                    console.error("Failed to create studio on the API.", error);
                });
                return {
                    ok: true,
                    message: "Your studio is live and ready for discovery.",
                    id,
                };
            },
            updateStudio: (id, draft) => {
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
                setStudios((current) =>
                    current.map((studio) =>
                        studio.id === id ? { ...studio, ...draft } : studio,
                    ),
                );
                apiRequest(`${API_BASE_URL}/studio/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(draft),
                }, user.email).catch((error: unknown) => {
                    console.error("Failed to update studio on the API.", error);
                });
                return {
                    ok: true,
                    message: "Studio details updated successfully.",
                    id,
                };
            },
            deleteStudio: (id) => {
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
                setStudios((current) =>
                    current.filter((studio) => studio.id !== id),
                );
                setBookings((current) =>
                    current.filter((booking) => booking.studioId !== id),
                );
                apiRequest(`${API_BASE_URL}/studio/${id}`, {
                    method: "DELETE",
                    headers: {
                    },
                }, user.email).catch((error: unknown) => {
                    console.error("Failed to delete studio on the API.", error);
                });
                return {
                    ok: true,
                    message: `${existing.title} has been removed.`,
                };
            },
            addBooking: (input) => {
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
                        booking.status !== "Confirmed"
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
                setBookings((current) => [booking, ...current]);
                apiRequest(`${API_BASE_URL}/booking`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...booking,
                        studioTitle: studio.title,
                    }),
                }, user.email).catch((error: unknown) => {
                    console.error("Failed to create booking on the API.", error);
                });
                return {
                    ok: true,
                    message:
                        "Reservation requested. The host will review your pending booking.",
                    id,
                };
            },
            cancelBooking: (id) => {
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
                setBookings((current) =>
                    current.map((item) =>
                        item.id === id
                            ? { ...item, status: "Cancelled" as const }
                            : item,
                    ),
                );
                apiRequest(`${API_BASE_URL}/booking/${id}/cancel`, {
                    method: "PATCH",
                    headers: {
                    },
                }, user.email).catch((error: unknown) => {
                    console.error("Failed to cancel booking on the API.", error);
                });
                return {
                    ok: true,
                    message: "Booking cancelled. The host has been notified.",
                };
            },
            toggleWishlist: (studioId) => {
                if (!user)
                    return {
                        ok: false,
                        message: "Log in to save studios to your wishlist.",
                    };
                const exists = (wishlistMap[user.email] ?? []).includes(
                    studioId,
                );
                setWishlistMap((current) => {
                    const saved = current[user.email] ?? [];
                    return {
                        ...current,
                        [user.email]: exists
                            ? saved.filter((id) => id !== studioId)
                            : [...saved, studioId],
                    };
                });
                apiRequest(`${API_BASE_URL}/wishlist`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.email, studioId }),
                }, user.email).catch((error: unknown) => {
                    console.error("Failed to update wishlist on the API.", error);
                });
                return {
                    ok: true,
                    message: exists
                        ? "Removed from your saved studios."
                        : "Saved to your creative shortlist.",
                };
            },
        }),
        [
            bookings,
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
        ],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used inside AppProvider");
    return context;
}
