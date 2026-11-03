import { Suspense } from "react";
import Studios from "@/views/Studios";
import { PageLoader } from "@/components/Loaders";
import { fetchStudios } from "@/lib/server-api";

export default async function Page() {
    const studios = await fetchStudios();

    return (
        <Suspense fallback={<PageLoader />}>
            <Studios studios={studios} />
        </Suspense>
    );
}
