import { Suspense } from "react";
import MyListings from "@/views/MyListings";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLoader } from "@/components/Loaders";

export default function Page() {
    return (
        <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
                <MyListings />
            </ProtectedRoute>
        </Suspense>
    );
}
