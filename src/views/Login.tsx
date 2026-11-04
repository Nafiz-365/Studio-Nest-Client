"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthLayout, { GoogleButton } from "../components/AuthLayout";
import { authClient } from "../lib/auth-client";
import { useApp } from "../lib/AppContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
    const { login } = useApp();
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromParam = searchParams?.get("from");
    const emailParam = searchParams?.get("email");
    const destination = fromParam?.startsWith("/") ? fromParam : "/";
    const [email, setEmail] = useState(emailParam ?? "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [socialSubmitting, setSocialSubmitting] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        const nextFieldErrors = {
            email: !email.trim()
                ? "Enter your email address."
                : !/^\S+@\S+\.\S+$/.test(email.trim())
                  ? "Enter a valid email address."
                  : "",
            password: !password ? "Enter your password." : "",
        };
        setFieldErrors(nextFieldErrors);
        if (nextFieldErrors.email || nextFieldErrors.password) {
            return;
        }
        setSubmitting(true);
        try {
            const result = await login(email.trim(), password);
            if (!result.ok) {
                setError(result.message);
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            router.replace(destination);
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
                callbackURL: destination,
            });
        } catch (socialError) {
            setSocialSubmitting(false);
            const message =
                socialError instanceof Error
                    ? socialError.message
                    : "Google sign-in could not be started.";
            setError(message);
            toast.error(message);
        }
    };

    return (
        <AuthLayout mode="login">
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
                Log in to your creative space.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted">
                Pick up a booking, manage your listings, or find the room for
                what comes next.
            </p>
            <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
                {error && (
                    <div
                        role="alert"
                        className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs leading-5 text-red-500"
                    >
                        {error}
                    </div>
                )}
                <div>
                    <Label htmlFor="login-email" className="mb-2!">
                        Email address
                    </Label>
                    <div className="relative">
                        <Mail size={17} className="field-icon" />
                        <Input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
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
                                    ? "login-email-error"
                                    : undefined
                            }
                            suppressHydrationWarning
                        />
                    </div>
                    {fieldErrors.email && (
                        <p
                            id="login-email-error"
                            className="mt-1.5 text-xs text-red-500"
                        >
                            {fieldErrors.email}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="login-password" className="mb-2!">
                        Password
                    </Label>
                    <div className="relative">
                        <LockKeyhole size={17} className="field-icon" />
                        <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setFieldErrors((current) => ({
                                    ...current,
                                    password: "",
                                }));
                                setError("");
                            }}
                            className="h-12! min-h-11! rounded-2xl! pl-11! pr-12!"
                            placeholder="Your password"
                            required
                            aria-invalid={Boolean(fieldErrors.password)}
                            aria-describedby={
                                fieldErrors.password
                                    ? "login-password-error"
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
                    {fieldErrors.password && (
                        <p
                            id="login-password-error"
                            className="mt-1.5 text-xs text-red-500"
                        >
                            {fieldErrors.password}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={submitting || socialSubmitting}
                    aria-busy={submitting}
                    className="btn-primary min-h-12! w-full disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <span className="spinner" />
                            Opening your studio…
                        </>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>
            <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                    or continue with
                </span>
                <span className="h-px flex-1 bg-line" />
            </div>
            <GoogleButton
                onClick={continueWithGoogle}
                disabled={socialSubmitting}
                label={
                    socialSubmitting
                        ? "Connecting to Google…"
                        : "Continue with Google"
                }
            />
            <p className="mt-8 text-center text-sm text-muted">
                New to StudioNest?{" "}
                <Link
                    href="/register"
                    className="font-semibold text-text underline decoration-[#b3d75a] decoration-2 underline-offset-4"
                >
                    Create an account
                </Link>
            </p>
        </AuthLayout>
    );
}
