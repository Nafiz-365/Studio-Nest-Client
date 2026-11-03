"use client";

import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    CalendarCheck,
    Camera,
    Check,
    Headphones,
    Pause,
    Play,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import SectionHeading from "../components/SectionHeading";
import StudioCard from "../components/StudioCard";
import { StudioCardSkeleton } from "../components/Loaders";
import { categories } from "../data/studios";
import type { Studio } from "../types";
import { useLoading } from "../lib/useLoading";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const slides = [
    {
        image: "/images/studio-cyc.jpg",
        eyebrow: "Spaces for the work that matters",
        title: (
            <>
                Your next scene
                <br />
                <em>starts here.</em>
            </>
        ),
        text: "Book remarkable studios directly from the people who know them best. Clear rates, real availability, no middlemen.",
        tag: "Northlight Cyc · Brooklyn",
    },
    {
        image: "/images/studio-stage.jpg",
        eyebrow: "From first frame to final cut",
        title: (
            <>
                Big production.
                <br />
                <em>Zero friction.</em>
            </>
        ),
        text: "Find sound stages, pre-rigged sets, and production-ready rooms with the specifications your crew actually needs.",
        tag: "Stage 04 · Los Angeles",
    },
    {
        image: "/images/studio-podcast-dark.jpg",
        eyebrow: "Press record on something original",
        title: (
            <>
                A room that
                <br />
                <em>sounds like you.</em>
            </>
        ),
        text: "Step into acoustically tuned podcast rooms and music suites, with the right kit already in place.",
        tag: "Afterglow Audio · Seattle",
    },
];

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Discover spaces",
        text: "Filter by craft, neighborhood, capacity, and budget. Every listing shows the details that shape a production day.",
    },
    {
        number: "02",
        icon: CalendarCheck,
        title: "Select shoot hours",
        text: "Choose your date and session length with live collision checks against confirmed studio reservations.",
    },
    {
        number: "03",
        icon: BadgeCheck,
        title: "Book instantly",
        text: "See the full rate, service fee, and refundable deposit before sending one clear reservation request.",
    },
    {
        number: "04",
        icon: Camera,
        title: "Create & produce",
        text: "Arrive to a verified space, make your best work, and keep every booking detail in one calm dashboard.",
    },
];

const assurances = [
    {
        icon: ShieldCheck,
        title: "Host guarantee",
        text: "Eligible listings are covered for qualifying accidental damage, with a clear, human-led resolution process.",
    },
    {
        icon: BadgeCheck,
        title: "Verified profiles",
        text: "Identity and contact checks help creators and hosts know who is walking through the door.",
    },
    {
        icon: Wrench,
        title: "Equipment safety",
        text: "Detailed inventories and condition notes set expectations before valuable kit changes hands.",
    },
    {
        icon: Headphones,
        title: "24/7 host support",
        text: "Production rarely keeps office hours. Our support team is on call when a booking needs attention.",
    },
];

export default function HomePage({
    studios,
    featuredStudios,
}: {
    studios: Studio[];
    featuredStudios: Studio[];
}) {
    const loading = useLoading();
    const [activeSlide, setActiveSlide] = useState(0);
    const [isHeroPaused, setIsHeroPaused] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const swiperRef = useRef<SwiperInstance | null>(null);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const imageY = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", reduceMotion ? "0%" : "18%"],
    );
    const featured = featuredStudios.slice(0, 6);
    const averageRating = studios.length
        ? (
              studios.reduce((sum, studio) => sum + studio.rating, 0) /
              studios.length
          ).toFixed(1)
        : "—";

    useEffect(() => {
        const autoplay = swiperRef.current?.autoplay;
        if (!autoplay) return;
        if (isHeroPaused || reduceMotion) autoplay.stop();
        else autoplay.start();
    }, [isHeroPaused, reduceMotion]);

    const showSlide = (index: number) => {
        swiperRef.current?.slideToLoop(index);
        setActiveSlide(index);
    };

    const showPreviousSlide = () => {
        swiperRef.current?.slidePrev();
    };

    const showNextSlide = () => {
        swiperRef.current?.slideNext();
    };

    return (
        <>
            <div className="relative">
                <section
                    ref={heroRef}
                    className="relative isolate min-h-155 overflow-hidden bg-[#141611] text-white sm:min-h-[calc(100svh-76px)]"
                >
                    <motion.div
                        style={{ y: imageY }}
                        className="absolute inset-y-[-10%] inset-x-0 scale-[1.03]"
                    >
                        <Swiper
                            modules={[Autoplay, EffectFade]}
                            effect="fade"
                            speed={reduceMotion ? 0 : 1200}
                            autoplay={
                                reduceMotion || isHeroPaused
                                    ? false
                                    : {
                                          delay: 5600,
                                          disableOnInteraction: false,
                                      }
                            }
                            loop
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            onSlideChange={(swiper) =>
                                setActiveSlide(swiper.realIndex)
                            }
                            className="h-full w-full"
                        >
                            {slides.map((slide) => (
                                <SwiperSlide key={slide.image}>
                                    <Image
                                        height={5000}
                                        width={5000}
                                        src={slide.image}
                                        alt="Creative studio interior"
                                        className="h-full w-full object-cover brightness-[.72] saturate-[.82] transition duration-1000"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                    <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,5,.96)_0%,rgba(5,7,5,.7)_48%,rgba(5,7,5,.28)_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,7,5,.92)_0%,rgba(5,7,5,.18)_52%,rgba(5,7,5,.2)_100%)]" />
                    <div className="container-shell relative z-20 flex min-h-155 flex-col justify-center py-28 sm:min-h-[calc(100svh-76px)] sm:py-16">
                        <div className="max-w-4xl rounded-[28px] bg-black/10 p-1 sm:bg-black/15 sm:p-5 sm:backdrop-blur-[1px]">
                            {slides.map(
                                (slide, index) =>
                                    index === activeSlide && (
                                        <div key={index}>
                                            <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d9ff63] sm:mb-6 sm:text-[11px] sm:tracking-[0.22em]">
                                                <span className="h-px w-9 bg-[#d9ff63]" />
                                                {slide.eyebrow}
                                            </p>
                                            <h1 className="font-display text-[clamp(2.8rem,13vw,7.8rem)] font-semibold leading-[0.9] tracking-[-0.072em] sm:text-[clamp(3.35rem,8vw,7.8rem)] sm:leading-[0.88]">
                                                <span className="block pb-2">
                                                    {slide.title}
                                                </span>
                                            </h1>
                                            <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 sm:mt-6 sm:text-lg sm:leading-8">
                                                {slide.text}
                                            </p>
                                        </div>
                                    ),
                            )}
                            <div className="mt-7 flex flex-col gap-3 sm:mt-9 md:flex-row">
                                <Link
                                    href="/studios"
                                    className="btn-primary w-full min-h-13! px-5! md:w-auto md:min-h-14! md:px-7!"
                                >
                                    Explore Studios
                                    <ArrowUpRight size={19} />
                                </Link>
                                <Link
                                    href="/add-studio"
                                    className="btn-light w-full min-h-13! px-5! md:w-auto md:min-h-14! md:px-7"
                                >
                                    Host Your Space
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                        <div className="absolute bottom-5 right-4 z-40 flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-white/10 bg-black/20 px-2 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md transition-[background-color,border-color,transform] duration-500 ease-out sm:bottom-6 sm:right-8 sm:gap-3 sm:px-2.5 sm:py-2 lg:right-10">
                            <div className="hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 md:flex">
                                <ArrowDown
                                    size={15}
                                    className="animate-bounce"
                                />
                                Scroll to discover
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                <span className="font-display text-sm text-white/75">
                                    0{activeSlide + 1}
                                    <span className="mx-2 text-white/30">
                                        /
                                    </span>
                                    <span className="text-white/35">03</span>
                                </span>
                                <div
                                    className="flex w-20 gap-1.5 sm:w-28 sm:gap-2 md:w-48"
                                    role="tablist"
                                    aria-label="Hero slides"
                                >
                                    {slides.map((slide, index) => (
                                        <button
                                            key={slide.image}
                                            type="button"
                                            role="tab"
                                            aria-label={`Show slide ${index + 1}`}
                                            aria-selected={
                                                index === activeSlide
                                            }
                                            onClick={() => {
                                                showSlide(index);
                                            }}
                                            className="group h-5 flex-1 py-2"
                                        >
                                            <span className="block h-0.5 overflow-hidden bg-white/20 transition group-hover:bg-white/50">
                                                {index === activeSlide && (
                                                    <motion.span
                                                        key={activeSlide}
                                                        className="block h-full origin-left bg-[#d9ff63]"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{
                                                            duration:
                                                                reduceMotion ||
                                                                isHeroPaused
                                                                    ? 0.2
                                                                    : 5.5,
                                                            ease: "linear",
                                                        }}
                                                    />
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsHeroPaused((paused) => !paused)
                                }
                                className="icon-button h-9! w-9! border-white/20! bg-white/10! text-white! hover:border-[#d9ff63]! hover:bg-[#d9ff63]! hover:text-[#171915]!"
                                aria-label={
                                    isHeroPaused
                                        ? "Play hero slideshow"
                                        : "Pause hero slideshow"
                                }
                            >
                                {isHeroPaused ? (
                                    <Play size={14} fill="currentColor" />
                                ) : (
                                    <Pause size={14} />
                                )}
                            </button>
                            <div className="flex items-center gap-1 sm:hidden">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={showPreviousSlide}
                                    className="size-9! rounded-full! border-white/20! bg-black/20! text-white! backdrop-blur-md hover:border-[#d9ff63]! hover:bg-[#d9ff63]! hover:text-[#171915]!"
                                    aria-label="Previous hero slide"
                                >
                                    <ArrowLeft size={14} />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={showNextSlide}
                                    className="size-9! rounded-full! border-white/20! bg-black/20! text-white! backdrop-blur-md hover:border-[#d9ff63]! hover:bg-[#d9ff63]! hover:text-[#171915]!"
                                    aria-label="Next hero slide"
                                >
                                    <ArrowRight size={14} />
                                </Button>
                            </div>
                            <p className="hidden max-w-45 text-right text-[10px] uppercase tracking-[0.15em] text-white/45 lg:block">
                                {slides[activeSlide].tag}
                            </p>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 left-2 right-2 z-40 hidden items-center justify-between sm:flex sm:left-6 sm:right-6 lg:left-8 lg:right-8">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={showPreviousSlide}
                                className="pointer-events-auto size-9! rounded-full! border-white/20! bg-black/20! text-white! backdrop-blur-md hover:border-[#d9ff63]! hover:bg-[#d9ff63]! hover:text-[#171915]! sm:size-11!"
                                aria-label="Previous hero slide"
                            >
                                <ArrowLeft size={14} className="sm:hidden" />
                                <ArrowLeft
                                    size={16}
                                    className="hidden sm:block"
                                />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={showNextSlide}
                                className="pointer-events-auto size-9! rounded-full! border-white/20! bg-black/20! text-white! backdrop-blur-md hover:border-[#d9ff63]! hover:bg-[#d9ff63]! hover:text-[#171915]! sm:size-11!"
                                aria-label="Next hero slide"
                            >
                                <ArrowRight size={14} className="sm:hidden" />
                                <ArrowRight
                                    size={16}
                                    className="hidden sm:block"
                                />
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="relative z-30 border-b border-line bg-surface/95 backdrop-blur-md">
                    <div className="container-shell grid grid-cols-2 divide-x divide-line py-1 sm:grid-cols-4 sm:py-2">
                        {[
                            [String(studios.length), "independent spaces"],
                            [`${averageRating}/5`, "average guest rating"],
                            [String(categories.length), "creative disciplines"],
                            ["24/7", "real human support"],
                        ].map(([number, label]) => (
                            <div
                                key={label}
                                className="px-2 py-4 text-center sm:px-8 sm:py-7"
                            >
                                <p className="font-display text-xl font-semibold tracking-tighter sm:text-3xl">
                                    {number}
                                </p>
                                <p className="mt-1 text-[9px] font-medium uppercase leading-3 tracking-widest text-muted sm:text-xs sm:leading-normal sm:tracking-[0.14em]">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className="section-space">
                <div className="container-shell">
                    <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                        <SectionHeading
                            eyebrow="The shortlist"
                            title="Rooms creators keep coming back to."
                            description="Top-rated spaces with thoughtful hosts, production-ready amenities, and the kind of details that make a long day feel easy."
                        />
                        <Link
                            href="/studios"
                            className="btn-secondary shrink-0 self-start md:self-auto"
                        >
                            View all studios
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {loading
                            ? Array.from({ length: 6 }).map((_, index) => (
                                  <StudioCardSkeleton key={index} />
                              ))
                            : featured.map((studio, index) => (
                                  <StudioCard
                                      key={studio.id}
                                      studio={studio}
                                      index={index}
                                  />
                              ))}
                    </div>
                </div>
            </section>

            <section className="section-space border-y border-line bg-surface overflow-hidden">
                <div className="container-shell">
                    <SectionHeading
                        eyebrow="Choose your canvas"
                        title="What are you making today?"
                        description="Start with the kind of room you need. We’ll take care of the search from there."
                        align="center"
                    />
                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {categories.map((category, index) => {
                            const count = studios.filter(
                                (studio) => studio.category === category.name,
                            ).length;
                            return (
                                <motion.div
                                    key={category.name}
                                    initial={{
                                        opacity: 0,
                                        y: 35,
                                        rotate: index % 2 ? 1.5 : -1.5,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                        rotate: 0,
                                    }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{
                                        duration: 0.65,
                                        delay: index * 0.08,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <Link
                                        href={`/studios?category=${encodeURIComponent(category.name)}`}
                                        className="group relative flex aspect-4/5 flex-col justify-end overflow-hidden rounded-[22px] bg-[#1a1c17] p-5 text-white"
                                    >
                                        <Image
                                            height={5000}
                                            width={5000}
                                            src={category.image}
                                            alt={category.label}
                                            className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-110 group-hover:opacity-50"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-[#11130e] via-[#11130e]/15 to-transparent" />
                                        <div className="relative">
                                            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition group-hover:rotate-45 group-hover:bg-[#d9ff63] group-hover:text-[#171915]">
                                                <ArrowUpRight size={17} />
                                            </span>
                                            <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.04em]">
                                                {category.label}
                                            </h3>
                                            <p className="mt-2 text-xs leading-5 text-white/60">
                                                {category.description}
                                            </p>
                                            <p className="mt-4 border-t border-white/20 pt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#d9ff63]">
                                                {count} curated{" "}
                                                {count === 1
                                                    ? "space"
                                                    : "spaces"}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section-space">
                <div className="container-shell">
                    <div className="grid gap-12 lg:grid-cols-[.8fr_1.5fr] lg:gap-20">
                        <div>
                            <SectionHeading
                                eyebrow="From idea to call time"
                                title="Four steps. Then it’s all yours."
                                description="Booking creative space should feel like the easiest part of your production. No quote chains. No mystery fees."
                            />
                            <Link
                                href="/how-it-works"
                                className="btn-secondary mt-8"
                            >
                                See the full process
                                <ArrowRight size={17} />
                            </Link>
                        </div>
                        <div className="grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{
                                        duration: 0.55,
                                        delay: index * 0.08,
                                    }}
                                    className="group relative bg-surface p-7 sm:p-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-display text-xs font-semibold text-muted">
                                            {step.number}
                                        </span>
                                        <step.icon
                                            size={23}
                                            strokeWidth={1.5}
                                            className="text-[#84a92a]"
                                        />
                                    </div>
                                    <h3 className="mt-12 font-display text-2xl font-semibold tracking-[-0.04em]">
                                        {step.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-muted">
                                        {step.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-[#191b16] py-20 text-white sm:py-28">
                <div className="absolute -right-32 -top-32 h-105 w-105 rounded-full border border-[#d9ff63]/15" />
                <div className="absolute -right-20 -top-20 h-75 w-75 rounded-full border border-[#d9ff63]/10" />
                <div className="container-shell relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                    <motion.div
                        initial={{
                            opacity: 0,
                            clipPath: "inset(0 100% 0 0 round 28px)",
                        }}
                        whileInView={{
                            opacity: 1,
                            clipPath: "inset(0 0% 0 0 round 28px)",
                        }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative min-h-120"
                    >
                        <Image
                            height={5000}
                            width={5000}
                            src="/images/studio-loft.jpg"
                            alt="Daylight studio prepared for a creative session"
                            className="absolute inset-0 h-full w-full rounded-[28px] object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-[28px] bg-linear-to-t from-black/55 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-xl">
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                                    The StudioNest standard
                                </p>
                                <p className="mt-2 font-display text-xl font-semibold">
                                    Good spaces. Clear agreements.
                                </p>
                            </div>
                            <ShieldCheck
                                size={34}
                                className="shrink-0 text-[#d9ff63]"
                                strokeWidth={1.5}
                            />
                        </div>
                    </motion.div>
                    <div>
                        <SectionHeading
                            eyebrow="Create with confidence"
                            title="Your work is ambitious. Your booking shouldn’t be risky."
                            description="Practical protection and real support for both sides of every studio door."
                            inverse
                        />
                        <div className="mt-9 grid gap-x-7 gap-y-8 sm:grid-cols-2">
                            {assurances.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: 25 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.55,
                                    }}
                                >
                                    <item.icon
                                        size={22}
                                        className="text-[#d9ff63]"
                                        strokeWidth={1.6}
                                    />
                                    <h3 className="mt-4 font-display text-lg font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-white/50">
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-space">
                <div className="container-shell">
                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_.8fr]">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <Sparkles
                                className="mb-7 text-[#89ad32]"
                                size={30}
                                strokeWidth={1.5}
                            />
                            <blockquote className="font-display text-[clamp(2.2rem,4.5vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.055em]">
                                “We found the room on Tuesday, shot on Thursday,
                                and spent exactly zero hours chasing a quote.”
                            </blockquote>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d9ff63] font-display text-xs font-bold">
                                    NO
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Nina Okafor
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted">
                                        Independent fashion photographer,
                                        Brooklyn
                                    </p>
                                </div>
                                <div className="ml-auto hidden gap-0.5 text-[#d29b22] sm:flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill="currentColor"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        <div className="rounded-[28px] border border-line bg-surface p-7 sm:p-9">
                            <p className="eyebrow">For space owners</p>
                            <h3 className="mt-4 font-display text-3xl font-semibold tracking-tighter">
                                Your empty hours could be someone’s
                                breakthrough.
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-muted">
                                List on your terms, set your own rates, and meet
                                a community that respects the room as much as
                                you do.
                            </p>
                            <ul className="mt-6 space-y-3 text-sm">
                                {[
                                    "Free, detailed listings",
                                    "Control every availability window",
                                    "Transparent booking records",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d9ff63] text-[#171915]">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/add-studio"
                                className="btn-primary mt-8 w-full"
                            >
                                List your creative space
                                <ArrowUpRight size={17} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
