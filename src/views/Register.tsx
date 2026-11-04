"use client";

import {
    Check,
    Eye,
    EyeOff,
    Image,
    LockKeyhole,
    Mail,
    UserRound,
    X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthLayout, { GoogleButton } from "../components/AuthLayout";
import { authClient } from "../lib/auth-client";
import { useApp } from "../lib/AppContext";
import { cn } from "../lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
    const { register } = useApp();
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        photoURL: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        photoURL: "",
        password: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [socialSubmitting, setSocialSubmitting] = useState(false);
    const checks = useMemo(
        () => [
            {
                label: "One uppercase letter",
                valid: /[A-Z]/.test(form.password),
            },
            {
                label: "One lowercase letter",
                valid: /[a-z]/.test(form.password),
            },
            {
                label: "At least 6 characters",
                valid: form.password.length >= 6,
            },
        ],
        [form.password],
    );
    const update = (field: keyof typeof form, value: string) =>
        setForm((current) => ({ ...current, [field]: value }));

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        const nextFieldErrors = {
            name:
                form.name.trim().length < 2
                    ? "Enter your name (at least 2 characters)."
                    : "",
            email: !/^\S+@\S+\.\S+$/.test(form.email.trim())
                ? "Enter a valid email address."
                : "",
            photoURL:
                form.photoURL && !/^https?:\/\/\S+$/i.test(form.photoURL.trim())
                    ? "Use a valid image URL, or leave this optional field blank."
                    : "",
            password: checks.some((check) => !check.valid)
                ? "Use all three password requirements below."
                : "",
        };
        setFieldErrors(nextFieldErrors);
        if (Object.values(nextFieldErrors).some(Boolean)) {
            setError("Please check the highlighted fields before continuing.");
            toast.error("Please check the highlighted fields.");
            return;
        }
        setSubmitting(true);
        try {
            const result = await register(
                form.name.trim(),
                form.email.trim(),
                form.photoURL.trim(),
                form.password,
            );
            if (!result.ok) {
                setError(result.message);
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            router.replace("/");
        } finally {
            setSubmitting(false);
        }
    };

    const continueWithGoogle = async () => {
        setError("");
        setSocialSubmitting(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (socialError) {
            setSocialSubmitting(false);
            const message =
                socialError instanceof Error
                    ? socialError.message
                    : "Google sign-up could not be started.";
            setError(message);
            toast.error(message);
        }
    };

    return (
        <AuthLayout mode="register">
            <p className="eyebrow">Join the community</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                Make space for your next idea.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted">
                One account to book remarkable rooms or share your own with
                fellow creators.
            </p>
            <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
                {error && (
                    <div
                        role="alert"
                        className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-5 text-red-500"
                    >
                        {error}
                    </div>
                )}
                <div>
                    <Label htmlFor="register-name" className="mb-2!">
                        Full name
                    </Label>
                    <div className="relative">
                        <UserRound size={17} className="field-icon" />
                        <Input
                            id="register-name"
                            autoComplete="name"
                            value={form.name}
                            onChange={(event) => {
                                update("name", event.target.value);
                                setFieldErrors((current) => ({
                                    ...current,
                                    name: "",
                                }));
                                setError("");
                            }}
                            className="h-12! min-h-11! rounded-2xl! pl-11!"
                            placeholder="Your name"
                            required
                            aria-invalid={Boolean(fieldErrors.name)}
                            aria-describedby={
                                fieldErrors.name
                                    ? "register-name-error"
                                    : undefined
                            }
                        />
                    </div>
                    {fieldErrors.name && (
                        <p
                            id="register-name-error"
                            className="mt-1.5 text-xs text-red-500"
                        >
                            {fieldErrors.name}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="register-email" className="mb-2!">
                        Email address
                    </Label>
                    <div className="relative">
                        <Mail size={17} className="field-icon" />
                        <Input
                            id="register-email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={(event) => {
                                update("email", event.target.value);
                                setFieldErrors((current) => ({
                                    ...current,
                                    email: "",
                                }));
                                setError("");
                            }}
                            className="h-12! min-h-11! rounded-2xl! pl-11!"
                            placeholder="you@studio.com"
                            required
                            aria-invalid={Boolean(fieldErrors.email)}
                            aria-describedby={
                                fieldErrors.email
                                    ? "register-email-error"
                                    : undefined
                            }
                            suppressHydrationWarning
                        />
                    </div>
                    {fieldErrors.email && (
                        <p
                            id="register-email-error"
                            className="mt-1.5 text-xs text-red-500"
                        >
                            {fieldErrors.email}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="register-photo" className="mb-2!">
                        Photo URL{" "}
                        <span className="font-normal text-muted">
                            (optional)
                        </span>
                    </Label>
                    <div className="relative">
                        <Image
                            size={17}
                            className="field-icon"
                            aria-label="Image"
                        />
                        <Input
                            id="register-photo"
                            type="url"
                            value={form.photoURL}
                            onChange={(event) => {
                                update("photoURL", event.target.value);
                                setFieldErrors((current) => ({
                                    ...current,
                                    photoURL: "",
                                }));
                            }}
                            className="h-12! min-h-11! rounded-2xl! pl-11!"
                            placeholder="https://example.com/portrait.jpg"
                            aria-invalid={Boolean(fieldErrors.photoURL)}
                            aria-describedby={
                                fieldErrors.photoURL
                                    ? "register-photo-error"
                                    : undefined
                            }
                        />
                    </div>
                    {fieldErrors.photoURL && (
                        <p
                            id="register-photo-error"
                            className="mt-1.5 text-xs text-red-500"
                        >
                            {fieldErrors.photoURL}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="register-password" className="mb-2!">
                        Password
                    </Label>
                    <div className="relative">
                        <LockKeyhole size={17} className="field-icon" />
                        <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={form.password}
                            onChange={(event) => {
                                update("password", event.target.value);
                                setFieldErrors((current) => ({
                                    ...current,
                                    password: "",
                                }));
                                setError("");
                            }}
                            className="h-12! min-h-11! rounded-2xl! pl-11! pr-12!"
                            placeholder="Create a secure password"
                            required
                            aria-invalid={Boolean(fieldErrors.password)}
                            aria-describedby={
                                fieldErrors.password
                                    ? "register-password-error"
                                    : undefined
                            }
                            suppressHydrationWarning
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((show) => !show)}
                            className="absolute inset-y-0 right-3 flex w-10 items-center justify-center rounded-full text-muted transition hover:bg-bg hover:text-text"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={17} />
                            ) : (
                                <Eye size={17} />
                            )}
                        </button>
                    </div>
                </div>
                <div className="grid gap-2 rounded-2xl bg-bg p-4 sm:grid-cols-3">
                    {checks.map((check) => (
                        <div
                            key={check.label}
                            className={cn(
                                "flex items-center gap-1.5 text-[10px] leading-4",
                                check.valid ? "text-emerald-600" : "text-muted",
                            )}
                        >
                            {check.valid ? (
                                <Check size={12} strokeWidth={3} />
                            ) : (
                                <X size={12} />
                            )}
                            {check.label}
                        </div>
                    ))}
                </div>
                {fieldErrors.password && (
                    <p
                        id="register-password-error"
                        className="-mt-1 text-xs text-red-500"
                    >
                        {fieldErrors.password}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={submitting || socialSubmitting}
                    aria-busy={submitting}
                    className="btn-primary min-h-12! w-full disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <span className="spinner" />
                            Creating your account…
                        </>
                    ) : (
                        "Register"
                    )}
                </button>
            </form>
            <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                    or
                </span>
                <span className="h-px flex-1 bg-line" />
            </div>
            <GoogleButton
                onClick={continueWithGoogle}
                disabled={socialSubmitting}
                label={
                    socialSubmitting
                        ? "Connecting to Google…"
                        : "Sign up with Google"
                }
            />
            <p className="mt-8 text-center text-sm text-muted">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-semibold text-text underline decoration-[#b3d75a] decoration-2 underline-offset-4"
                >
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
}
