"use client";

import { Heart } from "lucide-react";
import EmptyState from "../components/EmptyState";
import StudioCard from "../components/StudioCard";
import { useApp } from "../lib/AppContext";

export default function Wishlist() {
    const { studios, wishlist } = useApp();
    const saved = studios.filter((studio) => wishlist.includes(studio.id));
    return (
        <div className="container-shell section-space">
            <div>
                <p className="eyebrow">Your creative shortlist</p>
                <h1 className="page-title mt-4">Saved studios.</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                    Keep the rooms that sparked an idea close at hand. Your
                    shortlist is tied to your account and saved across reloads.
                </p>
            </div>
            <div className="mt-10">
                {saved.length ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {saved.map((studio, index) => (
                            <StudioCard
                                key={studio.id}
                                studio={studio}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Heart size={28} />}
                        title="Nothing on the shortlist yet"
                        description="Tap the heart on any studio card to keep it here. It’s a useful way to compare rooms before choosing your session hours."
                        actionLabel="Find a studio to save"
                        actionTo="/studios"
                    />
                )}
            </div>
        </div>
    );
}
