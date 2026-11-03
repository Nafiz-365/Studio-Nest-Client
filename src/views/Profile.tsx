"use client";

import { Camera, Mail, Save, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useApp } from "@/lib/AppContext";
import { Avatar } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
    const { user, isAuthPending } = useApp();
    const [name, setName] = useState(user?.name ?? "");
    const [image, setImage] = useState(user?.photoURL ?? "");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        const timer = window.setTimeout(() => {
            setName(user.name);
            setImage(user.photoURL ?? "");
        }, 0);
        return () => window.clearTimeout(timer);
    }, [user]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (!name.trim()) {
            toast.error("Enter your name before saving.");
            return;
        }

        setSaving(true);
        const { error } = await authClient.updateUser({
            name: name.trim(),
            image: image.trim() || undefined,
        });
        setSaving(false);

        if (error) {
            toast.error(error.message || "Your profile could not be updated.");
            return;
        }
        toast.success("Your profile has been updated.");
    };

    if (isAuthPending || !user) return null;

    return (
        <main className="container-shell section-space">
            <div className="mx-auto max-w-3xl">
                <p className="eyebrow">Your account</p>
                <h1 className="page-title mt-4">Profile settings.</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                    Keep your creator identity current. Your name and photo may
                    appear beside listings and booking activity.
                </p>

                <section className="mt-10 rounded-[28px] border border-line bg-surface p-6 sm:p-8">
                    <div className="flex flex-col items-start gap-5 border-b border-line pb-7 sm:flex-row sm:items-center">
                        <Avatar
                            name={user.name}
                            photoURL={user.photoURL}
                            className="h-20 w-20 text-xl"
                        />
                        <div>
                            <p className="font-display text-xl font-semibold">
                                {user.name}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                                <Mail size={14} />
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="mt-7 space-y-5">
                        <div>
                            <Label htmlFor="profile-name">Full name</Label>
                            <div className="relative mt-2">
                                <UserRound size={17} className="field-icon" />
                                <Input
                                    id="profile-name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    className="pl-11!"
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="profile-email">Email address</Label>
                            <div className="relative mt-2">
                                <Mail size={17} className="field-icon" />
                                <Input
                                    id="profile-email"
                                    value={user.email}
                                    className="pl-11! opacity-60"
                                    readOnly
                                />
                            </div>
                            <p className="mt-2 text-xs text-muted">
                                Email changes are disabled here to keep booking
                                ownership secure.
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="profile-image">
                                Profile photo URL{" "}
                                <span className="font-normal text-muted">
                                    (optional)
                                </span>
                            </Label>
                            <div className="relative mt-2">
                                <Camera size={17} className="field-icon" />
                                <Input
                                    id="profile-image"
                                    type="url"
                                    value={image}
                                    onChange={(event) =>
                                        setImage(event.target.value)
                                    }
                                    className="pl-11!"
                                    placeholder="https://example.com/your-photo.jpg"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end border-t border-line pt-5">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                            >
                                <Save size={16} />
                                {saving ? "Saving…" : "Save profile"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}
