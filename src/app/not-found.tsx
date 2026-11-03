import { Building2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function NotFound() {
    return (
        <main className="container-shell section-space">
            <EmptyState
                icon={<Building2 size={28} />}
                title="This studio page went off set"
                description="The page you requested does not exist or the studio has been removed."
                actionLabel="Return to Home"
                actionTo="/"
            />
        </main>
    );
}
