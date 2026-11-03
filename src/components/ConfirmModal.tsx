"use client";

import { AlertTriangle } from "lucide-react";

interface Props {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
}

export default function ConfirmModal({
    open,
    title,
    description,
    confirmLabel,
    onClose,
    onConfirm,
}: Props) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                className="w-full max-w-sm rounded-xl bg-popover p-5 text-popover-foreground shadow-2xl ring-1 ring-foreground/10"
            >
                <h2 id="confirm-modal-title" className="text-base font-medium">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                </p>
                <div className="mb-6 mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                    <AlertTriangle size={23} />
                </div>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={confirmLabel.endsWith("…")}
                    >
                        Keep it
                    </button>
                    <button
                        type="button"
                        className="btn-danger"
                        onClick={() => {
                            void onConfirm();
                        }}
                        disabled={confirmLabel.endsWith("…")}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
