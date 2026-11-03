import HomePage from "@/views/Home";
import { fetchFeaturedStudios, fetchStudios } from "@/lib/server-api";

export default async function Home() {
    const [studios, featuredStudios] = await Promise.all([
        fetchStudios(),
        fetchFeaturedStudios(),
    ]);

    return <HomePage studios={studios} featuredStudios={featuredStudios} />;
}
