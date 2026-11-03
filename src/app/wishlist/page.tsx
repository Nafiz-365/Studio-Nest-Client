import { Suspense } from "react";
import Wishlist from "@/views/Wishlist";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLoader } from "@/components/Loaders";

export default function Page() {
    return (
        <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
                <Wishlist />
            </ProtectedRoute>
        </Suspense>
    );
}
