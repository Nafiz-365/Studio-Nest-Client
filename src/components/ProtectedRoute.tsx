"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "@/lib/AppContext";
import { PageLoader } from "@/components/Loaders";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isHydrated, isAuthPending } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const hasMounted = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot,
    );

    useEffect(() => {
        if (hasMounted && isHydrated && !isAuthPending && !user) {
            router.replace(
                `/login?from=${encodeURIComponent(pathname || "/")}`,
            );
        }
    }, [hasMounted, isHydrated, isAuthPending, user, router, pathname]);

    if (!hasMounted || !isHydrated || isAuthPending || !user) {
        return <PageLoader />;
    }

    return <>{children}</>;
}
