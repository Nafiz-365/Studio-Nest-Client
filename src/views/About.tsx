"use client";

import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Check,
    HandHeart,
    Lightbulb,
    ShieldCheck,
    UsersRound,
} from "lucide-react";
import Link from "next/link";
import SectionHeading from "../components/SectionHeading";

export default function About() {
    return (
        <>
            <section className="container-shell py-16 sm:py-24">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="eyebrow"
                >
                    About StudioNest
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-6 max-w-6xl font-display text-[clamp(3.3rem,8vw,8rem)] font-semibold leading-[0.9] tracking-[-0.072em]"
                >
                    Great work needs
                    <br />
                    <span className="font-light italic text-[#7d9f2c]">
                        room to happen.
                    </span>
                </motion.h1>
                <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
                    <p className="max-w-xl text-lg leading-8 text-muted">
                        StudioNest is a peer-to-peer creative workspace
                        marketplace built around a simple belief: independent
                        creators deserve easier access to exceptional rooms, and
                        exceptional rooms deserve people who will use them well.
                    </p>
                    <p className="max-w-lg text-sm leading-7 text-muted md:ml-auto">
                        We bring photographers, filmmakers, podcasters,
                        musicians, artists, and space owners into one clear
                        system for discovery, booking, and production records.
                        No opaque quote chains. Just useful details and direct
                        creative exchange.
                    </p>
                </div>
            </section>
            <section className="container-shell pb-20">
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.97,
                        clipPath: "inset(8% 4% round 30px)",
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                        clipPath: "inset(0% 0% round 30px)",
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    <img
                        src="/images/studio-cinema.jpg"
                        alt="Independent filmmakers collaborating on set"
                        className="aspect-[16/8] min-h-[340px] w-full rounded-[30px] object-cover"
                    />
                    <div className="absolute inset-0 rounded-[30px] bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <p className="absolute bottom-7 left-7 max-w-md font-display text-2xl font-medium leading-tight tracking-[-0.04em] text-white sm:bottom-10 sm:left-10 sm:text-4xl">
                        Built for the people behind the work.
                    </p>
                </motion.div>
            </section>
            <section className="border-y border-line bg-surface section-space">
                <div className="container-shell">
                    <SectionHeading
                        eyebrow="What guides us"
                        title="A marketplace with a maker’s mindset."
                        description="The platform is shaped around the realities of creative work: changing call times, valuable equipment, ambitious ideas, and trust."
                        align="center"
                    />
                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {[
                            {
                                icon: Lightbulb,
                                number: "01",
                                title: "Utility before noise",
                                text: "We prioritize the information that changes a production decision: real dimensions, actual amenities, capacity, complete rates, and honest house rules.",
                            },
                            {
                                icon: HandHeart,
                                number: "02",
                                title: "Trust is a feature",
                                text: "Verified profiles, ownership-protected editing, booking status records, and collision checks make every interaction more accountable.",
                            },
                            {
                                icon: UsersRound,
                                number: "03",
                                title: "Independence scales both ways",
                                text: "A one-room host deserves the same clarity as a full production stage. A first-time creator deserves the same access as a seasoned crew.",
                            },
                        ].map((value, index) => (
                            <motion.article
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex h-full flex-col rounded-[24px] border border-line bg-bg p-7 sm:p-8"
                            >
                                <div className="flex items-center justify-between">
                                    <value.icon
                                        size={25}
                                        className="text-[#7c9e2b]"
                                        strokeWidth={1.5}
                                    />
                                    <span className="font-display text-xs text-muted">
                                        {value.number}
                                    </span>
                                </div>
                                <h3 className="mt-12 font-display text-2xl font-semibold tracking-[-0.04em]">
                                    {value.title}
                                </h3>
                                <p className="mt-4 text-sm leading-7 text-muted">
                                    {value.text}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>
            <section className="section-space">
                <div className="container-shell grid items-center gap-12 lg:grid-cols-[.85fr_1fr] lg:gap-20">
                    <div className="relative">
                        <img
                            src="/images/studio-art.jpg"
                            alt="A bright independent artist studio"
                            className="aspect-[4/5] w-full rounded-[28px] object-cover"
                        />
                        <div className="absolute bottom-5 right-5 rounded-2xl bg-[#d9ff63] p-5 text-[#171915]">
                            <p className="font-display text-3xl font-bold tracking-[-0.05em]">
                                5 disciplines
                            </p>
                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                                one creative community
                            </p>
                        </div>
                    </div>
                    <div>
                        <SectionHeading
                            eyebrow="Why peer to peer"
                            title="The best creative spaces are often already nearby."
                            description="They sit above warehouses, behind shopfronts, inside former barns, and in spare rooms tuned with years of care. StudioNest makes those underused hours discoverable without taking away the host’s judgment or the creator’s independence."
                        />
                        <ul className="mt-8 space-y-4">
                            {[
                                "Hosts set the rate, capacity, and expectations",
                                "Creators compare complete details before requesting",
                                "Bookings stay documented from pending to completed",
                                "Support and safeguards sit behind every exchange",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d9ff63] text-[#171915]">
                                        <Check size={11} strokeWidth={3} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/add-studio" className="btn-primary mt-8">
                            Share your space
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>
            <section className="container-shell pb-20">
                <div className="relative overflow-hidden rounded-[30px] bg-[#1a1c17] px-7 py-14 text-center text-white sm:px-12 sm:py-20">
                    <ShieldCheck
                        className="mx-auto text-[#d9ff63]"
                        size={32}
                        strokeWidth={1.4}
                    />
                    <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.055em]">
                        Come for the room.
                        <br />
                        Stay for what you make in it.
                    </h2>
                    <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/55">
                        Discover your next creative space, or open your own door
                        to a community of makers.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link href="/studios" className="btn-primary">
                            Explore studios
                            <ArrowUpRight size={17} />
                        </Link>
                        <Link href="/register" className="btn-light">
                            Join StudioNest
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
