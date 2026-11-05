import { Suspense } from "react";
import HostBookings from "@/views/HostBookings";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLoader } from "@/components/Loaders";

export default function Page() {
    return (
        <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
                <HostBookings />
            </ProtectedRoute>
        </Suspense>
    );
}
