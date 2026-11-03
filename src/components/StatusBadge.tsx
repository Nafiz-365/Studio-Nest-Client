import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "../types";

const variantMap: Record<
    BookingStatus,
    "link" | "default" | "secondary" | "destructive" | "outline" | "ghost"
> = {
    Pending: "secondary",
    Confirmed: "default",
    Completed: "outline",
    Cancelled: "destructive",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
    return (
        <Badge variant={variantMap[status]}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </Badge>
    );
}
