"use client";

import { Aperture, ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="container-shell flex min-h-[calc(100svh-76px)] items-center py-16">
            <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mx-auto flex aspect-square w-full max-w-120 items-center justify-center overflow-hidden rounded-[36px] bg-[#1a1c17]"
                >
                    <div className="absolute inset-8 rounded-full border border-[#d9ff63]/15" />
                    <div className="absolute inset-20 rounded-full border border-[#d9ff63]/20" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <Aperture
                            size={190}
                            strokeWidth={0.55}
                            className="text-[#d9ff63]/70"
                        />
                    </motion.div>
                    <div className="absolute flex h-36 w-36 items-center justify-center rounded-full bg-[#d9ff63] font-display text-6xl font-bold tracking-[-0.08em] text-[#1a1c17]">
                        404
                    </div>
                    <span className="absolute bottom-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                        Frame not found
                    </span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.65 }}
                >
                    <p className="eyebrow">This room is off the record</p>
                    <h1 className="mt-5 font-display text-[clamp(3.2rem,6vw,6rem)] font-semibold leading-[0.94] tracking-[-0.065em]">
                        Wrong set.
                        <br />
                        <span className="font-light italic text-[#7b9d29]">
                            Right way back.
                        </span>
                    </h1>
                    <p className="mt-6 max-w-md text-base leading-8 text-muted">
                        The page you’re looking for has moved, wrapped, or never
                        made the shot list. Head home or explore a studio that’s
                        ready for its close-up.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/" className="btn-primary">
                            <ArrowLeft size={17} />
                            Return to Home
                        </Link>
                        <Link href="/studios" className="btn-secondary">
                            Explore studios
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
