"use client";

import {
    ArrowLeft,
    ArrowRight,
    Check,
    ImagePlus,
    Lock,
    Upload,
    X,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { amenityOptions, categories } from "../data/studios";
import { useApp } from "../lib/AppContext";
import type { Category, Studio, StudioDraft } from "../types";
import { cn, formatMoney } from "../lib/utils";
import Image from "next/image";

interface FormState {
    title: string;
    category: Category;
    rate: string;
    deposit: string;
    capacity: string;
    location: string;
    address: string;
    images: string[];
    amenities: string[];
    overview: string;
    size: string;
    rules: string;
}

const emptyForm: FormState = {
    title: "",
    category: "Photo Studio",
    rate: "",
    deposit: "",
    capacity: "",
    location: "",
    address: "",
    images: [],
    amenities: [],
    overview: "",
    size: "",
    rules: "",
};

const MAX_STUDIO_IMAGES = 6;

export default function StudioForm({ studio }: { studio?: Studio }) {
    const { user, addStudio, updateStudio } = useApp();
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<FormState>(() =>
        studio
            ? {
                  title: studio.title,
                  category: studio.category,
                  rate: String(studio.rate),
                  deposit: String(studio.deposit),
                  capacity: String(studio.capacity),
                  location: studio.location,
                  address: studio.address,
                  images: studio.images,
                  amenities: studio.amenities,
                  overview: studio.overview,
                  size: String(studio.size),
                  rules: studio.rules.join("\n"),
              }
            : emptyForm,
    );
    const [saving, setSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [uploadingImages, setUploadingImages] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const update = <K extends keyof FormState>(
        field: K,
        value: FormState[K],
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: "" }));
    };

    const addImage = (image: string) => {
        setForm((current) =>
            current.images.includes(image)
                ? current
                : { ...current, images: [...current.images, image] },
        );
        setErrors((current) => ({ ...current, images: "" }));
    };

    const addImageUrl = () => {
        if (form.images.length >= MAX_STUDIO_IMAGES) {
            toast.error(
                `You can add up to ${MAX_STUDIO_IMAGES} studio images.`,
            );
            return;
        }
        const value = imageUrl.trim();
        try {
            const parsedUrl = new URL(value);
            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                throw new Error("Unsupported image URL protocol.");
            }
        } catch {
            toast.error(
                "Enter a valid image URL starting with http:// or https://.",
            );
            return;
        }
        if (form.images.includes(value)) {
            toast.error("This image has already been added.");
            return;
        }
        addImage(value);
        setImageUrl("");
        toast.success("Image URL added to your studio gallery.");
    };

    const upload = async (files?: FileList | null) => {
        const selectedFiles = Array.from(files ?? []);
        if (!selectedFiles.length) return;
        const remainingSlots = MAX_STUDIO_IMAGES - form.images.length;
        if (remainingSlots <= 0) {
            toast.error(
                `You can add up to ${MAX_STUDIO_IMAGES} studio images.`,
            );
            return;
        }
        if (selectedFiles.length > remainingSlots) {
            toast.error(
                `Only ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"} can be added. The first ${remainingSlots} selected will be uploaded.`,
            );
        }
        const filesToUpload = selectedFiles.slice(0, remainingSlots);
        const imgbbKey =
            process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
            (typeof process !== "undefined" && process.env?.VITE_IMGBB_API_KEY);
        const loadingToast = toast.loading(
            `Adding ${filesToUpload.length} image${filesToUpload.length === 1 ? "" : "s"}...`,
        );
        let addedCount = 0;
        setUploadingImages(true);
        try {
            for (const file of filesToUpload) {
                if (
                    !["image/jpeg", "image/png", "image/webp"].includes(
                        file.type,
                    )
                ) {
                    toast.error(
                        `${file.name}: choose a JPG, PNG, or WebP image.`,
                    );
                    continue;
                }

                let image: string | null = null;
                if (imgbbKey) {
                    try {
                        const formData = new FormData();
                        formData.append("image", file);
                        const response = await fetch(
                            `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
                            { method: "POST", body: formData },
                        );
                        const data = await response.json();
                        if (response.ok && data?.success && data?.data?.url) {
                            image = data.data.url;
                        } else {
                            toast.error(
                                `${file.name}: image hosting upload failed.`,
                            );
                        }
                    } catch {
                        toast.error(
                            `${file.name}: image hosting upload failed.`,
                        );
                    }
                }

                if (!image) {
                    if (file.size > 900 * 1024) {
                        toast.error(
                            `${file.name}: local images must be smaller than 900 KB.`,
                        );
                        continue;
                    }
                    image = await new Promise<string | null>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () =>
                            resolve(
                                typeof reader.result === "string"
                                    ? reader.result
                                    : null,
                            );
                        reader.onerror = () => resolve(null);
                        reader.readAsDataURL(file);
                    });
                    if (!image) {
                        toast.error(`${file.name}: image could not be read.`);
                        continue;
                    }
                }

                addImage(image);
                addedCount += 1;
            }
        } finally {
            setUploadingImages(false);
            toast.dismiss(loadingToast);
        }
        if (addedCount) {
            toast.success(
                `${addedCount} image${addedCount === 1 ? "" : "s"} added to your studio gallery.`,
            );
        }
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (uploadingImages) {
            toast.error("Wait for image uploads to finish before saving.");
            return;
        }
        const nextErrors: Record<string, string> = {};
        if (form.title.trim().length < 3)
            nextErrors.title =
                "Use a descriptive title with at least 3 characters.";
        if (!Number(form.rate) || Number(form.rate) < 1)
            nextErrors.rate = "Enter an hourly rate above $0.";
        if (Number(form.deposit) < 0 || form.deposit === "")
            nextErrors.deposit = "Enter a deposit of $0 or more.";
        if (!Number(form.capacity) || Number(form.capacity) < 1)
            nextErrors.capacity = "Capacity must be at least one person.";
        if (!Number(form.size) || Number(form.size) < 50)
            nextErrors.size = "Enter a floor area of at least 50 sq ft.";
        if (!form.location.trim())
            nextErrors.location = "Add the city and state.";
        if (!form.address.trim())
            nextErrors.address = "Add the full studio address.";
        if (!form.images.length)
            nextErrors.images = "Add at least one studio image.";
        if (form.overview.trim().length < 60)
            nextErrors.overview =
                "Give creators at least 60 characters of useful detail.";
        if (!form.amenities.length)
            nextErrors.amenities = "Select at least one available amenity.";
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) {
            toast.error("A few listing details still need your attention.");
            document
                .querySelector(".field-error")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        const draft: StudioDraft = {
            title: form.title.trim(),
            category: form.category,
            rate: Number(form.rate),
            deposit: Number(form.deposit),
            capacity: Number(form.capacity),
            location: form.location.trim(),
            address: form.address.trim(),
            images: form.images,
            amenities: form.amenities,
            overview: form.overview.trim(),
            size: Number(form.size),
            rules: form.rules
                .split("\n")
                .map((rule) => rule.trim())
                .filter(Boolean),
        };
        if (!draft.rules.length)
            draft.rules = [
                "Leave the studio clean and reset all included equipment",
                "Report accidental damage before checkout",
                "Overtime is billed in 30-minute increments when available",
            ];
        setSaving(true);
        window.setTimeout(async () => {
            const result = studio
                ? await updateStudio(studio.id, draft)
                : await addStudio(draft);
            setSaving(false);
            if (!result.ok) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            router.push("/my-listings");
        }, 550);
    };

    return (
        <form
            onSubmit={submit}
            className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_330px]"
        >
            <div className="min-w-0 space-y-6">
                <section className="form-section">
                    <div className="form-section-heading">
                        <span className="shrink-0">01</span>
                        <div className="min-w-0">
                            <h2>Studio essentials</h2>
                            <p>The clear, useful details creators see first.</p>
                        </div>
                    </div>
                    <div className="mt-7 space-y-5">
                        <div>
                            <label
                                htmlFor="studio-title"
                                className="field-label"
                            >
                                Studio title
                            </label>
                            <input
                                id="studio-title"
                                value={form.title}
                                onChange={(event) =>
                                    update("title", event.target.value)
                                }
                                className={cn(
                                    "field",
                                    errors.title && "field-error",
                                )}
                                placeholder="e.g. Sunroom Editorial Studio"
                            />
                            {errors.title && (
                                <p className="field-error-text">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="studio-category"
                                    className="field-label"
                                >
                                    Category
                                </label>
                                <select
                                    id="studio-category"
                                    value={form.category}
                                    onChange={(event) =>
                                        update(
                                            "category",
                                            event.target.value as Category,
                                        )
                                    }
                                    className="field"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category.name}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="studio-size"
                                    className="field-label"
                                >
                                    Floor area (sq ft)
                                </label>
                                <input
                                    id="studio-size"
                                    type="number"
                                    min="50"
                                    value={form.size}
                                    onChange={(event) =>
                                        update("size", event.target.value)
                                    }
                                    className={cn(
                                        "field",
                                        errors.size && "field-error",
                                    )}
                                    placeholder="1200"
                                />
                                {errors.size && (
                                    <p className="field-error-text">
                                        {errors.size}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="studio-rate"
                                    className="field-label"
                                >
                                    Hourly rate ($)
                                </label>
                                <input
                                    id="studio-rate"
                                    type="number"
                                    min="1"
                                    value={form.rate}
                                    onChange={(event) =>
                                        update("rate", event.target.value)
                                    }
                                    className={cn(
                                        "field",
                                        errors.rate && "field-error",
                                    )}
                                    placeholder="85"
                                />
                                {errors.rate && (
                                    <p className="field-error-text">
                                        {errors.rate}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="studio-deposit"
                                    className="field-label"
                                >
                                    Security deposit ($)
                                </label>
                                <input
                                    id="studio-deposit"
                                    type="number"
                                    min="0"
                                    value={form.deposit}
                                    onChange={(event) =>
                                        update("deposit", event.target.value)
                                    }
                                    className={cn(
                                        "field",
                                        errors.deposit && "field-error",
                                    )}
                                    placeholder="150"
                                />
                                {errors.deposit && (
                                    <p className="field-error-text">
                                        {errors.deposit}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="studio-capacity"
                                    className="field-label"
                                >
                                    Maximum capacity
                                </label>
                                <input
                                    id="studio-capacity"
                                    type="number"
                                    min="1"
                                    value={form.capacity}
                                    onChange={(event) =>
                                        update("capacity", event.target.value)
                                    }
                                    className={cn(
                                        "field",
                                        errors.capacity && "field-error",
                                    )}
                                    placeholder="12"
                                />
                                {errors.capacity && (
                                    <p className="field-error-text">
                                        {errors.capacity}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="studio-location"
                                    className="field-label"
                                >
                                    City & state
                                </label>
                                <input
                                    id="studio-location"
                                    value={form.location}
                                    onChange={(event) =>
                                        update("location", event.target.value)
                                    }
                                    className={cn(
                                        "field",
                                        errors.location && "field-error",
                                    )}
                                    placeholder="Brooklyn, New York"
                                />
                                {errors.location && (
                                    <p className="field-error-text">
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="studio-address"
                                className="field-label"
                            >
                                Location / full address
                            </label>
                            <input
                                id="studio-address"
                                value={form.address}
                                onChange={(event) =>
                                    update("address", event.target.value)
                                }
                                className={cn(
                                    "field",
                                    errors.address && "field-error",
                                )}
                                placeholder="Street address, city, state, postal code"
                            />
                            {errors.address && (
                                <p className="field-error-text">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <div className="form-section-heading">
                        <span className="shrink-0">02</span>
                        <div className="min-w-0">
                            <h2>Show the space</h2>
                            <p>
                                Use a bright, landscape photo that reflects the
                                actual studio.
                            </p>
                        </div>
                    </div>
                    <div className="mt-7">
                        <label
                            htmlFor="studio-image-url"
                            className="field-label"
                        >
                            Studio images
                        </label>
                        <p className="mb-3 text-xs leading-5 text-muted">
                            Add up to six views. The first image will be the
                            main photo shown on your listing.
                        </p>
                        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                            <input
                                id="studio-image-url"
                                type="url"
                                value={imageUrl}
                                onChange={(event) =>
                                    setImageUrl(event.target.value)
                                }
                                disabled={
                                    uploadingImages ||
                                    form.images.length >= MAX_STUDIO_IMAGES
                                }
                                className={cn(
                                    "field min-w-0 flex-1",
                                    errors.images && "field-error",
                                )}
                                placeholder="https://your-image-host.com/studio.jpg"
                            />
                            <button
                                type="button"
                                onClick={addImageUrl}
                                disabled={
                                    !imageUrl.trim() ||
                                    uploadingImages ||
                                    form.images.length >= MAX_STUDIO_IMAGES
                                }
                                className="btn-secondary whitespace-nowrap"
                            >
                                <ImagePlus size={16} />
                                Add URL
                            </button>
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={
                                    uploadingImages ||
                                    form.images.length >= MAX_STUDIO_IMAGES
                                }
                                className="btn-secondary whitespace-nowrap"
                            >
                                <Upload size={16} />
                                {uploadingImages
                                    ? "Adding images..."
                                    : "Upload images"}
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                onChange={(event) => {
                                    void upload(event.target.files);
                                    event.currentTarget.value = "";
                                }}
                            />
                        </div>
                        {errors.images && (
                            <p className="field-error-text">{errors.images}</p>
                        )}
                        {form.images.length ? (
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {form.images.map((image, index) => (
                                    <div
                                        key={`${image.slice(0, 80)}-${index}`}
                                        className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-soft"
                                    >
                                        <Image
                                            height={600}
                                            width={800}
                                            src={image}
                                            alt={`Studio photo ${index + 1}`}
                                            className="h-full w-full object-cover"
                                            unoptimized
                                        />
                                        {index === 0 && (
                                            <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                                Main photo
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setForm((current) => ({
                                                    ...current,
                                                    images: current.images.filter(
                                                        (_, imageIndex) =>
                                                            imageIndex !==
                                                            index,
                                                    ),
                                                }))
                                            }
                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm transition hover:bg-black"
                                            aria-label={`Remove studio photo ${index + 1}`}
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="mt-4 flex aspect-16/6 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-bg text-muted transition hover:border-[#9cbb4e] hover:text-text"
                            >
                                <ImagePlus size={28} strokeWidth={1.4} />
                                <span className="mt-3 text-xs font-semibold">
                                    Add your best studio view
                                </span>
                                <span className="mt-1 text-[10px]">
                                    Select multiple JPG, PNG or WebP images
                                </span>
                            </button>
                        )}
                    </div>
                </section>

                <section className="form-section">
                    <div className="form-section-heading">
                        <span className="shrink-0">03</span>
                        <div className="min-w-0">
                            <h2>Amenities & overview</h2>
                            <p>
                                Help creators plan with confidence before they
                                book.
                            </p>
                        </div>
                    </div>
                    <div className="mt-7">
                        <span className="field-label">Available amenities</span>
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                            {amenityOptions.map((amenity) => {
                                const checked =
                                    form.amenities.includes(amenity);
                                return (
                                    <label
                                        key={amenity}
                                        className={cn(
                                            "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs transition",
                                            checked
                                                ? "border-[#a8ca5b] bg-[#d9ff63]/15"
                                                : "border-line bg-bg hover:bg-soft",
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                update(
                                                    "amenities",
                                                    checked
                                                        ? form.amenities.filter(
                                                              (item) =>
                                                                  item !==
                                                                  amenity,
                                                          )
                                                        : [
                                                              ...form.amenities,
                                                              amenity,
                                                          ],
                                                )
                                            }
                                            className="sr-only"
                                        />
                                        <span
                                            className={cn(
                                                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                                                checked
                                                    ? "border-[#7e9f2e] bg-[#a8cd4b] text-[#171915]"
                                                    : "border-line",
                                            )}
                                        >
                                            {checked && (
                                                <Check
                                                    size={11}
                                                    strokeWidth={3}
                                                />
                                            )}
                                        </span>
                                        {amenity}
                                    </label>
                                );
                            })}
                        </div>
                        {errors.amenities && (
                            <p className="field-error-text">
                                {errors.amenities}
                            </p>
                        )}
                    </div>
                    <div className="mt-6">
                        <label
                            htmlFor="studio-overview"
                            className="field-label"
                        >
                            Detailed overview
                        </label>
                        <textarea
                            id="studio-overview"
                            value={form.overview}
                            onChange={(event) =>
                                update("overview", event.target.value)
                            }
                            className={cn(
                                "field min-h-40 resize-y leading-6",
                                errors.overview && "field-error",
                            )}
                            placeholder="Describe the light, layout, included equipment, atmosphere, and what kind of production the room suits best."
                            maxLength={1600}
                        />
                        <div className="mt-1 flex justify-between gap-4">
                            <div>
                                {errors.overview && (
                                    <p className="field-error-text">
                                        {errors.overview}
                                    </p>
                                )}
                            </div>
                            <span className="text-[10px] text-muted">
                                {form.overview.length}/1600
                            </span>
                        </div>
                    </div>
                    <div className="mt-5">
                        <label htmlFor="studio-rules" className="field-label">
                            House rules{" "}
                            <span className="font-normal text-muted">
                                (one per line)
                            </span>
                        </label>
                        <textarea
                            id="studio-rules"
                            value={form.rules}
                            onChange={(event) =>
                                update("rules", event.target.value)
                            }
                            className="field min-h-28 resize-y leading-6"
                            placeholder={
                                "No open flame\nReset included equipment before checkout\nNo glitter or confetti"
                            }
                        />
                    </div>
                </section>
            </div>

            <aside className="min-w-0 space-y-5 lg:sticky lg:top-28">
                <div className="rounded-[24px] border border-line bg-surface p-5">
                    <p className="eyebrow">Host account</p>
                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="field-label">Host name</label>
                            <div className="relative">
                                <input
                                    value={user?.name ?? ""}
                                    readOnly
                                    className="field pr-10! opacity-70"
                                />
                                <Lock
                                    size={14}
                                    className="absolute right-4 top-4 text-muted"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="field-label">Host email</label>
                            <div className="relative">
                                <input
                                    value={user?.email ?? ""}
                                    readOnly
                                    className="field pr-10! opacity-70"
                                />
                                <Lock
                                    size={14}
                                    className="absolute right-4 top-4 text-muted"
                                />
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-[10px] leading-4 text-muted">
                        Host details are locked to your signed-in account and
                        appear on the public listing.
                    </p>
                </div>
                <div className="rounded-[24px] bg-[#1a1c17] p-6 text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d9ff63]">
                        Live rate preview
                    </p>
                    <p className="mt-4 font-display text-4xl font-bold tracking-[-0.055em]">
                        {formatMoney(Number(form.rate) || 0)}
                        <span className="text-sm font-normal text-white/45">
                            {" "}
                            / hr
                        </span>
                    </p>
                    <p className="mt-3 text-xs leading-5 text-white/50">
                        Creators also see the refundable deposit and an 8%
                        service fee before requesting a booking.
                    </p>
                    <div className="mt-5 border-t border-white/15 pt-4 text-xs text-white/65">
                        {form.amenities.length} amenities selected ·{" "}
                        {form.capacity || 0} guests maximum
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving || uploadingImages}
                    className="btn-primary min-h-13! w-full disabled:opacity-60"
                >
                    {saving ? (
                        <>
                            <span className="spinner" />
                            Saving your studio…
                        </>
                    ) : (
                        <>
                            {studio ? "Save studio changes" : "Publish studio"}
                            <ArrowRight size={17} />
                        </>
                    )}
                </button>
                <Link
                    href="/my-listings"
                    className="btn-ghost mx-auto flex text-xs"
                >
                    <ArrowLeft size={14} />
                    Cancel and return
                </Link>
            </aside>
        </form>
    );
}
