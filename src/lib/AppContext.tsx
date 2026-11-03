"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { createSeedBookings, seedStudios } from "../data/studios";
import type {
    ActionResult,
    AuthUser,
    Booking,
    BookingInput,
    Studio,
    StudioDraft,
    User,
} from "../types";
import { calculateHours, createId, toDateInput } from "./utils";

const STORAGE = {
    studios: "studionest.studios.v1",
    bookings: "studionest.bookings.v1",
    users: "studionest.users.v1",
    session: "studionest.session.v1",
    wishlist: "studionest.wishlist.v1",
    theme: "studionest.theme.v1",
};

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const demoUser: AuthUser = {
    name: "Maya Chen",
    email: "demo@studionest.co",
    password: "Studio1",
    photoURL: "",
};

function readStorage<T>(key: string, fallback: T): T {
    try {
        if (typeof window === "undefined") return fallback;
        const value = localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : fallback;
    } catch {
        return fallback;
    }
}

interface AppContextValue {
    studios: Studio[];
    bookings: Booking[];
    user: User | null;
    users: AuthUser[];
    theme: "light" | "dark";
    wishlist: string[];
    isHydrated: boolean;
    toggleTheme: () => void;
    login: (email: string, password: string) => ActionResult;
    register: (
        name: string,
        email: string,
        photoURL: string,
        password: string,
    ) => ActionResult;
    googleLogin: () => User;
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
    const [bookings, setBookings] = useState<Booking[]>(createSeedBookings);
    const [users, setUsers] = useState<AuthUser[]>([demoUser]);
    const [user, setUser] = useState<User | null>(null);
    const [wishlistMap, setWishlistMap] = useState<Record<string, string[]>>(
        {},
    );
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        try {
            const savedUser = readStorage<User | null>(STORAGE.session, null);
            if (savedUser) setUser(savedUser);

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

            const savedUsers = readStorage<AuthUser[] | null>(
                STORAGE.users,
                null,
            );
            if (savedUsers && Array.isArray(savedUsers) && savedUsers.length)
                setUsers(savedUsers);

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
            localStorage.setItem(STORAGE.users, JSON.stringify(users));
        } catch {
            // Ignore persistence failures.
        }
    }, [users, isHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        try {
            if (user)
                localStorage.setItem(STORAGE.session, JSON.stringify(user));
            else localStorage.removeItem(STORAGE.session);
        } catch {
            // Ignore persistence failures.
        }
    }, [user, isHydrated]);

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
            users,
            theme,
            wishlist,
            isHydrated,
            toggleTheme: () =>
                setTheme((current) => (current === "light" ? "dark" : "light")),
            login: (email, password) => {
                const account = users.find(
                    (item) =>
                        item.email.toLowerCase() === email.trim().toLowerCase(),
                );
                if (!account || account.password !== password) {
                    return {
                        ok: false,
                        message:
                            "That email and password combination does not match our records.",
                    };
                }
                setUser({
                    name: account.name,
                    email: account.email,
                    photoURL: account.photoURL,
                });
                return {
                    ok: true,
                    message: `Welcome back, ${account.name.split(" ")[0]}.`,
                };
            },
            register: (name, email, photoURL, password) => {
                const normalizedEmail = email.trim().toLowerCase();
                if (
                    users.some(
                        (item) => item.email.toLowerCase() === normalizedEmail,
                    )
                ) {
                    return {
                        ok: false,
                        message:
                            "An account already exists with this email. Try logging in instead.",
                    };
                }
                const account: AuthUser = {
                    name: name.trim(),
                    email: normalizedEmail,
                    photoURL: photoURL.trim(),
                    password,
                };
                setUsers((current) => [...current, account]);
                return {
                    ok: true,
                    message:
                        "Your StudioNest account is ready. Log in to start creating.",
                };
            },
            googleLogin: () => {
                const googleUser: User = {
                    name: "Alex Morgan",
                    email: "alex.morgan@gmail.com",
                    photoURL: "",
                };
                setUsers((current) =>
                    current.some((item) => item.email === googleUser.email)
                        ? current
                        : [
                              ...current,
                              { ...googleUser, password: createId("google") },
                          ],
                );
                setUser(googleUser);
                return googleUser;
            },
            logout: () => setUser(null),
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
                    createdAt: toDateInput(new Date()),
                    featured: false,
                    hostSince: String(new Date().getFullYear()),
                    responseTime: "New host · typically replies within a day",
                };
                setStudios((current) => [studio, ...current]);
                fetch(`${API_BASE_URL}/add-studio`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer demo-token`,
                        "x-user-email": user.email,
                    },
                    body: JSON.stringify(studio),
                }).catch(() => {});
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
                fetch(`${API_BASE_URL}/studio/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer demo-token`,
                        "x-user-email": user.email,
                    },
                    body: JSON.stringify(draft),
                }).catch(() => {});
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
                fetch(`${API_BASE_URL}/studio/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer demo-token`,
                        "x-user-email": user.email,
                    },
                }).catch(() => {});
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
                if (input.date < toDateInput(new Date()))
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
                const start = new Date(
                    `${input.date}T${input.startTime}:00`,
                ).getTime();
                const end = new Date(
                    `${input.date}T${input.endTime}:00`,
                ).getTime();
                const collision = bookings.find((booking) => {
                    if (
                        booking.studioId !== input.studioId ||
                        booking.date !== input.date ||
                        booking.status !== "Confirmed"
                    )
                        return false;
                    const bookedStart = new Date(
                        `${booking.date}T${booking.startTime}:00`,
                    ).getTime();
                    const bookedEnd = new Date(
                        `${booking.date}T${booking.endTime}:00`,
                    ).getTime();
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
                    createdAt: new Date().toISOString(),
                };
                setBookings((current) => [booking, ...current]);
                fetch(`${API_BASE_URL}/booking`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...booking,
                        studioTitle: studio.title,
                    }),
                }).catch(() => {});
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
                fetch(`${API_BASE_URL}/booking/${id}/cancel`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer demo-token`,
                        "x-user-email": user.email,
                    },
                }).catch(() => {});
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
                fetch(`${API_BASE_URL}/wishlist`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.email, studioId }),
                }).catch(() => {});
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
            setUsers,
            setWishlistMap,
            studios,
            theme,
            user,
            users,
            wishlist,
            wishlistMap,
            isHydrated,
        ],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used inside AppProvider");
    return context;
}
