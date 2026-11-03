import StudioDetails from "@/views/StudioDetails";
import { fetchStudio, fetchStudios } from "@/lib/server-api";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [studio, studios] = await Promise.all([
        fetchStudio(id),
        fetchStudios(),
    ]);
    const related = studio
        ? studios
              .filter(
                  (item) => item.id !== id && item.category === studio.category,
              )
              .slice(0, 3)
        : [];

    return <StudioDetails studio={studio} related={related} />;
}
