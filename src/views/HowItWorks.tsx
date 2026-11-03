"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowUpRight,
    CalendarCheck,
    Check,
    ChevronDown,
    ClipboardCheck,
    KeyRound,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Star,
    Upload,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import SectionHeading from "../components/SectionHeading";
import { cn } from "../lib/utils";
import Image from "next/image";

const creatorSteps = [
    {
        icon: Search,
        title: "Build your brief",
        text: "Search by discipline, location, crew size, or a specific piece of equipment. Compare full specifications and recent creator reviews.",
    },
    {
        icon: CalendarCheck,
        title: "Choose your hours",
        text: "Pick a date and session window. StudioNest checks your request against confirmed reservations to catch time collisions.",
    },
    {
        icon: ClipboardCheck,
        title: "Review one clear total",
        text: "Your summary separates studio hire, the 8% creator service fee, and the refundable security deposit. No hidden line items.",
    },
    {
        icon: KeyRound,
        title: "Make something great",
        text: "Track the host decision from My Bookings. Confirmed sessions include a downloadable PDF invoice for your production records.",
    },
];

const hostSteps = [
    {
        icon: Upload,
        title: "Publish your space",
        text: "Add strong photography, honest specifications, your rate, deposit, amenities, and house rules through the private listing editor.",
    },
    {
        icon: SlidersHorizontal,
        title: "Stay in control",
        text: "Update any listing detail as your equipment or policies change. Your host contact details remain locked to your account.",
    },
    {
        icon: ClipboardCheck,
        title: "Review each request",
        text: "New reservations begin as Pending. Production notes and crew size give you the context needed to make a confident decision.",
    },
    {
        icon: Star,
        title: "Build a reputation",
        text: "Thoughtful communication and accurate listings turn first-time bookings into repeat creative relationships.",
    },
];

const faqs = [
    {
        q: "When does a booking become confirmed?",
        a: "Every new reservation is saved as Pending. The host reviews the production notes and requested hours before confirmation. Your My Bookings page always shows the current status, and only Pending requests can be cancelled directly from that page.",
    },
    {
        q: "How does StudioNest prevent double bookings?",
        a: "Before a reservation is saved, the requested start and end times are compared with existing Confirmed bookings for the same studio and date. Any intersection is rejected with the conflicting time window, so you can choose another session.",
    },
    {
        q: "What does the security deposit cover?",
        a: "The deposit gives hosts a clear safeguard for qualifying damage, missing equipment, or policy breaches. It is separate from the studio hire and service fee, and is refundable after checkout subject to the host agreement.",
    },
    {
        q: "Can I change a listing after it is published?",
        a: "Yes. Open My Studio Listings and select Update. You can revise photos, rates, capacity, amenities, rules, and the full overview. Only the account that owns a listing can edit or delete it.",
    },
    {
        q: "Can I keep a shortlist before I am ready to book?",
        a: "Absolutely. Select the heart on any studio card while logged in. Saved Studios keeps your shortlist attached to your account, ready for your next visit.",
    },
];

export default function HowItWorks() {
    const [audience, setAudience] = useState<"creator" | "host">("creator");
    const [openFaq, setOpenFaq] = useState(0);
    const steps = audience === "creator" ? creatorSteps : hostSteps;
    return (
        <>
            <section className="relative overflow-hidden border-b border-line bg-surface">
                <div className="container-shell grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="eyebrow">How StudioNest works</p>
                        <h1 className="mt-5 font-display text-[clamp(3.2rem,6.5vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.065em]">
                            Less logistics.
                            <br />
                            <span className="font-light italic text-[#7c9e2b]">
                                More making.
                            </span>
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-8 text-muted">
                            A straightforward way to find creative space—and a
                            thoughtful way to share it. Here’s exactly what
                            happens on both sides of the door.
                        </p>
                        <Link href="/studios" className="btn-primary mt-8">
                            Start exploring
                            <ArrowUpRight size={17} />
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{
                            opacity: 0,
                            clipPath: "inset(0 0 0 100% round 28px)",
                        }}
                        animate={{
                            opacity: 1,
                            clipPath: "inset(0 0 0 0% round 28px)",
                        }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <Image
                            height={5000}
                            width={8000}
                            src="/images/studio-workshop.jpg"
                            alt="Creative workshop prepared for a group session"
                            className="aspect-4/3 w-full rounded-[28px] object-cover"
                        />
                        <div className="absolute -bottom-5 -left-3 max-w-62 rounded-[20px] border border-line bg-bg p-5 shadow-xl sm:-left-6">
                            <Sparkles size={20} className="text-[#7c9e2b]" />
                            <p className="mt-3 font-display text-lg font-semibold leading-tight">
                                One clear process, from discovery to wrap.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
            <section className="section-space">
                <div className="container-shell">
                    <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                        <SectionHeading
                            eyebrow="Your path through the platform"
                            title="Simple by design. Specific where it matters."
                        />
                        <div className="flex w-full shrink-0 rounded-full border border-line bg-surface p-1 sm:w-auto">
                            <button
                                type="button"
                                onClick={() => setAudience("creator")}
                                className={cn(
                                    "flex-1 rounded-full px-4 py-2.5 text-xs font-semibold transition sm:px-5",
                                    audience === "creator"
                                        ? "bg-text text-bg"
                                        : "text-muted",
                                )}
                            >
                                For creators
                            </button>
                            <button
                                type="button"
                                onClick={() => setAudience("host")}
                                className={cn(
                                    "flex-1 rounded-full px-4 py-2.5 text-xs font-semibold transition sm:px-5",
                                    audience === "host"
                                        ? "bg-text text-bg"
                                        : "text-muted",
                                )}
                            >
                                For hosts
                            </button>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={audience}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                            className="mt-12 grid gap-px overflow-hidden rounded-[26px] border border-line bg-line md:grid-cols-2 xl:grid-cols-4"
                        >
                            {steps.map((step, index) => (
                                <div
                                    key={step.title}
                                    className="relative bg-surface p-7 sm:p-8"
                                >
                                    <span className="absolute right-6 top-5 font-display text-5xl font-semibold tracking-[-0.07em] text-soft">
                                        0{index + 1}
                                    </span>
                                    <step.icon
                                        size={25}
                                        className="relative text-[#7b9d29]"
                                        strokeWidth={1.5}
                                    />
                                    <h3 className="relative mt-12 font-display text-2xl font-semibold tracking-[-0.04em]">
                                        {step.title}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 text-muted">
                                        {step.text}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
            <section className="border-y border-line bg-surface section-space">
                <div className="container-shell grid gap-12 lg:grid-cols-2 lg:gap-20">
                    <div>
                        <SectionHeading
                            eyebrow="Transparent by default"
                            title="Know the total before you request."
                            description="A four-hour session at an $85 hourly rate, shown exactly the way StudioNest calculates it."
                        />
                        <div className="mt-8 rounded-[24px] border border-line bg-bg p-6 sm:p-8">
                            {[
                                ["Studio hire · 4 hours × $85", "$340"],
                                ["Creator service fee · 8%", "$27"],
                                ["Refundable security deposit", "$200"],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex justify-between border-b border-line py-4 text-sm"
                                >
                                    <span className="text-muted">{label}</span>
                                    <span className="font-semibold">
                                        {value}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-end justify-between pt-6">
                                <span className="font-display text-lg font-semibold">
                                    Reservation total
                                </span>
                                <span className="font-display text-3xl font-bold tracking-tighter">
                                    $567
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-[28px] bg-[#1a1c17] p-8 text-white sm:p-10">
                        <ShieldCheck
                            size={34}
                            className="text-[#d9ff63]"
                            strokeWidth={1.4}
                        />
                        <h2 className="mt-8 font-display text-3xl font-semibold leading-tight tracking-tighter">
                            A booking is an agreement, not just a calendar
                            event.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-white/55">
                            Clear expectations protect creative time on both
                            sides. Every reservation keeps the important details
                            attached.
                        </p>
                        <ul className="mt-7 space-y-4">
                            {[
                                "Host identity and contact verification",
                                "Session date, hours, and crew size",
                                "Production notes and house rules",
                                "Status history and PDF records",
                                "Support throughout the reservation",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-white/75"
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d9ff63] text-[#171915]">
                                        <Check size={11} strokeWidth={3} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            <section className="section-space">
                <div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1fr] lg:gap-20">
                    <SectionHeading
                        eyebrow="Good to know"
                        title="Questions, answered clearly."
                        description="The practical details creators and hosts ask about most."
                    />
                    <div className="divide-y divide-line border-y border-line">
                        {faqs.map((faq, index) => (
                            <div key={faq.q}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenFaq(
                                            openFaq === index ? -1 : index,
                                        )
                                    }
                                    className="flex w-full items-center justify-between gap-5 py-6 text-left"
                                    aria-expanded={openFaq === index}
                                >
                                    <span className="font-display text-lg font-semibold tracking-tight">
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={cn(
                                            "shrink-0 text-muted transition duration-300",
                                            openFaq === index && "rotate-180",
                                        )}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-6 pr-8 text-sm leading-7 text-muted">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
