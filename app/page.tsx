"use client";

import { Button } from "@/components/ui/button";
import MagicInput from "@/components/ui/magic-input";
import Spline from "@splinetool/react-spline";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { CgSpinnerAlt, CgTerminal } from "react-icons/cg";
import { toast } from "sonner";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaLink } from "react-icons/fa6";
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [url, setUrl] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [step, setStep] = useState(1);
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const handleNext = (e: FormEvent) => {
        e.preventDefault();
        if (isValidUrl(url)) {
            setStep(2);
        } else {
            toast.error("Please enter a valid URL", {
                description: "The URL should start with http:// or https://",
            });
        }
    };
    const isValidUrl = (string: string): boolean => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    const shortenUrl = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsUrlLoading(true);
            const response = await fetch("/api/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url, shortCode }),
            });

            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                const shortUrl = `${window.location.origin}/${data.shortCode}`;
                handleCopy(shortUrl);
                setShortUrl(shortUrl);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
            } else {
                if (response.status === 429) {
                    toast.error("Rate limit exceeded", {
                        description: "Please try again later.",
                    });
                } else if (response.status === 400) {
                    toast.error("Invalid input", {
                        description:
                            data.error ||
                            "Please check your input and try again.",
                    });
                } else {
                    toast.error("Error", {
                        description:
                            data.error ||
                            "Failed to create short URL. Please try again.",
                    });
                }
            }
        } catch (error) {
            console.error("Error", error);
            toast.error("Network error", {
                description:
                    "Failed to connect to the server. Please check your internet connection and try again.",
            });
        } finally {
            setIsUrlLoading(false);
            setStep(1);
            setUrl("");
            setShortCode("");
        }
    };

    async function handleCopy(content: string) {
        await navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard", {
            description: "The short URL has been copied to your clipboard.",
        });
    }
    return (
        <main className="">
            <section className="w-full h-[100dvh] min-h-[500px] flex flex-col justify-center items-center gap-5 ">
                <div className="flex flex-col justify-center items-center gap-5 absolute z-30 ">
                    <h1 className="text-4xl leading-[36px] md:leading-[1] lg:leading-[1] md:text-5xl lg:text-6xl font-semibold text-center text-zinc-100">
                        Naturally short, <br />
                        Perfectly linked.
                    </h1>
                    <form className="flex flex-col items-center gap-2 w-full">
                        {step === 1 ? (
                            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                                <MagicInput
                                    type="url"
                                    placeholder="Long URL here..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    required
                                    className="w-full"
                                />
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-purple-700/45 transition-colors duration-300 backdrop-blur-2xl border w-full sm:w-[126.95px] text-purple-100 border-purple-400/45 hover:opacity-100 hover:bg-purple-700 hover:border-purple-400 flex flex-row justify-center items-center gap-3"
                                >
                                    Next
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                                <MagicInput
                                    type="text"
                                    placeholder="Custom short code (optional)"
                                    value={shortCode}
                                    onChange={(e) =>
                                        setShortCode(e.target.value)
                                    }
                                    className="w-full"
                                />
                                <Button
                                    type="submit"
                                    onClick={shortenUrl}
                                    className="bg-zinc-700/25 transition-colors duration-300 backdrop-blur-2xl border w-full sm:w-[126.95px] text-indigo-100 border-indigo-400/45 hover:opacity-100 hover:bg-indigo-600 hover:border-indigo-400 flex flex-row justify-center items-center gap-3"
                                >
                                    {isUrlLoading ? (
                                        <CgSpinnerAlt className="text-zinc-100 animate-spin" />
                                    ) : (
                                        "Shorten"
                                    )}
                                </Button>
                            </div>
                        )}
                    </form>
                    <div
                        onClick={() => handleCopy(shortUrl)}
                        className="flex flex-row items-center p-3 rounded-md w-full bg-zinc-700/25 backdrop-blur-2xl border border-zinc-600/50 cursor-pointer"
                    >
                        <FaLink
                            className="h-6 w-6 text-zinc-300"
                            color="#d4d4d8"
                        />
                        <AlertTitle className="text-zinc-300 text-base ml-2">
                            {shortUrl
                                ? shortUrl
                                : "Your link will appear here."}
                        </AlertTitle>
                    </div>
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
