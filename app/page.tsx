"use client";

import { Button } from "@/components/ui/button";
import GradientInput from "@/components/ui/gradient-input";
import { Input } from "@/components/ui/input";
import MagicInput from "@/components/ui/magic-input";
import Spline from "@splinetool/react-spline";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { toast } from "sonner";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [url, setUrl] = useState("");
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const shortenUrl = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsUrlLoading(true);
            const response = await fetch("/api/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();
            console.log("Response data:", data);

            if (data.success && data.shortCode) {
                const shortUrl = `${window.location.origin}/${data.shortCode}`;
                await navigator.clipboard.writeText(shortUrl);
                toast.success("Copied to clipboard", {
                    description:
                        "The short URL has been copied to your clipboard.",
                });
                setShowConfetti(true); // Trigger confetti
                setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
            } else {
                throw new Error(data.error || "Failed to create short URL");
            }
        } catch (error) {
            console.error("Error", error);
            toast.error("Error", {
                description: "Failed to create short URL. Please try again.",
            });
        } finally {
            setIsUrlLoading(false);
        }
    };
    return (
        <main className="">
            <section className="w-full h-[100dvh] min-h-[500px] flex flex-col justify-center items-center gap-5 ">
                <div className="flex flex-col justify-center items-center gap-5 absolute z-30 ">
                    <h1 className="text-4xl leading-[36px] md:leading-[1] lg:leading-[1] md:text-5xl lg:text-6xl font-semibold text-center text-zinc-100">
                        Naturally short, <br />
                        Perfectly linked.
                    </h1>
                    <form
                        onSubmit={shortenUrl}
                        className="flex flex-col sm:flex-row items-center gap-2 w-full"
                    >
                        {/* <Input
                            type="url"
                            placeholder="Long url here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="bg-zinc-900/55 backdrop-blur-sm text-zinc-300 border border-zinc-800/65 focus-visible:outline-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        ></Input> */}

                        <MagicInput
                            type="url"
                            placeholder="Long URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="w-full"
                        />

                        <Button
                            type="submit"
                            className="bg-zinc-700/25 transition-colors duration-300 backdrop-blur-xl border w-full sm:w-[126.95px] text-indigo-100 border-indigo-400/45 hover:opacity-100 hover:bg-indigo-600 hover:border-indigo-400 flex flex-row justify-center items-center gap-3"
                        >
                            {isUrlLoading ? (
                                <CgSpinnerAlt className="text-zinc-100 animate-spin" />
                            ) : (
                                "Shorten"
                            )}
                        </Button>
                    </form>
                </div>

                <div className="absolute w-full h-full bg-zinc-950/70 pointer-events-none"></div>
                <div className="w-full h-full absolute z-20">
                    {isLoading && (
                        <Image
                            src={"/imgs/bg.webp"}
                            alt="Loading Image"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    )}
                </div>

                <Spline
                    scene="https://prod.spline.design/mMmYwmFDZnxWsbpD/scene.splinecode"
                    className="absolute z-20"
                    onLoad={() => setIsLoading(false)}
                />
            </section>
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <ReactConfetti
                        width={width}
                        height={height}
                        recycle={false}
                        numberOfPieces={200}
                    />
                </div>
            )}
        </main>
    );
}
