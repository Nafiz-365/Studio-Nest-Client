"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    Bookmark,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Plus,
    Settings2,
    Sun,
    UserRound,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useApp } from "../lib/AppContext";
import { cn, getInitials } from "../lib/utils";
import Logo from "./Logo";
import {
    Avatar as ShadcnAvatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
    { label: "Home", to: "/" },
    { label: "Explore Studios", to: "/studios" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "About Us", to: "/about" },
];

export function Avatar({
    name,
    photoURL,
    className,
}: {
    name: string;
    photoURL?: string;
    className?: string;
}) {
    return (
        <ShadcnAvatar className={cn("h-10 w-10", className)}>
            <AvatarImage src={photoURL} alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </ShadcnAvatar>
    );
}

export default function Header() {
    const { user, logout, theme, isHydrated, toggleTheme } = useApp();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname() || "/";
    const renderedTheme = isMounted && isHydrated ? theme : "light";
    const visibleUser = isMounted && isHydrated ? user : null;

    useEffect(() => {
        const timer = window.setTimeout(() => setIsMounted(true), 0);
        return () => window.clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success("You have been logged out. See you in the studio soon.");
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-xl">
            <div className="container-shell flex h-20 items-center justify-between gap-3 sm:gap-5">
                <div className="min-w-0 shrink">
                    <Logo />
                </div>
                <nav
                    className="hidden items-center gap-1 lg:flex"
                    aria-label="Main navigation"
                >
                    {links.map((link) => {
                        const isActive =
                            link.to === "/"
                                ? pathname === "/"
                                : pathname.startsWith(link.to);
                        return (
                            <Link
                                key={link.to}
                                href={link.to}
                                className={cn(
                                    "nav-link",
                                    isActive && "nav-link-active",
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="icon-button"
                        aria-label={`Switch to ${renderedTheme === "light" ? "dark" : "light"} theme`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={renderedTheme}
                                initial={{ rotate: -40, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 40, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                            >
                                {renderedTheme === "light" ? (
                                    <Moon size={18} />
                                ) : (
                                    <Sun size={18} />
                                )}
                            </motion.span>
                        </AnimatePresence>
                    </button>

                    {visibleUser ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-full border border-line bg-surface p-1 pr-3 transition hover:border-[#a9c95a]"
                                    aria-label="Open account menu"
                                >
                                    <ShadcnAvatar className="h-8 w-8">
                                        <AvatarImage
                                            src={visibleUser.photoURL}
                                            alt={visibleUser.name}
                                        />
                                        <AvatarFallback>
                                            {getInitials(visibleUser.name)}
                                        </AvatarFallback>
                                    </ShadcnAvatar>
                                    <span className="hidden max-w-28 truncate text-xs font-semibold text-text sm:block">
                                        {visibleUser.name}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="px-3 pb-3 pt-2 font-normal">
                                        <p className="truncate text-sm font-semibold text-text">
                                            {visibleUser.name}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-muted">
                                            {visibleUser.email}
                                        </p>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <UserRound
                                            size={16}
                                            className="text-muted"
                                        />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">
                                        <LayoutDashboard
                                            size={16}
                                            className="text-muted"
                                        />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/add-studio">
                                        <Plus
                                            size={16}
                                            className="text-muted"
                                        />
                                        Add New Studio
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-listings">
                                        <Settings2
                                            size={16}
                                            className="text-muted"
                                        />
                                        My Studio Listings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/my-bookings">
                                        <Bookmark
                                            size={16}
                                            className="text-muted"
                                        />
                                        My Bookings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/wishlist">
                                        <Bookmark
                                            size={16}
                                            className="text-muted"
                                        />
                                        Saved Studios
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-500 focus:bg-red-500/5 focus:text-red-500"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link href="/login" className="btn-ghost">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="btn-primary min-h-10! px-5!"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    <button
                        type="button"
                        className="icon-button lg:hidden"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label="Toggle navigation"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-line bg-bg lg:hidden"
                    >
                        <nav
                            className="container-shell flex flex-col gap-1 py-5"
                            aria-label="Mobile navigation"
                            onClick={(event) => {
                                if ((event.target as HTMLElement).closest("a"))
                                    setMobileOpen(false);
                            }}
                        >
                            {links.map((link, index) => {
                                const isActive =
                                    link.to === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(link.to);
                                return (
                                    <motion.div
                                        key={link.to}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                    >
                                        <Link
                                            href={link.to}
                                            className={cn(
                                                "block rounded-xl px-4 py-3 font-display text-lg font-medium",
                                                isActive
                                                    ? "bg-soft text-text"
                                                    : "text-muted",
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                            {!visibleUser && (
                                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-5 sm:hidden">
                                    <Link
                                        href="/login"
                                        className="btn-secondary"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="btn-primary"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
