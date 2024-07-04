"use client";
import Link from "next/link";
import { useState } from "react";
import Separator from "./Separator";
export default function Footer() {
    return (
        <footer className="bg-zinc-900 text-white pb-8">
            <Separator className="mb-8" />

            <div className="flex flex-col items-center justify-between md:flex-row px-12">
                <div className="flex flex-col items-center">
                    <Link
                        href="#"
                        className="text-5xl font-medium"
                        prefetch={false}
                    >
                        Naturl
                    </Link>

                    <Link
                        href={"https://buymeacoffee.com/tobiasr"}
                        className="text-[12.5px]  text-gray-400 duration-500 hover:scale-105 hover:text-zinc-100 drop-shadow-md hover:drop-shadow-[0_4px_14px_0_rgb(0,118,255,39%)]"
                    >
                        Made with <span className="animate-pulse">❤️‍🔥</span> by
                        Tobias
                    </Link>
                </div>
                <nav className="flex items-center space-x-6 mt-4 md:mt-0">
                    <Link
                        href="/"
                        className="text-sm text-zinc-400 font-medium hover:text-zinc-200 transition-colors"
                        prefetch={false}
                    >
                        Home
                    </Link>
                    <Link
                        href="https://github.com/tobiasrasmsn/naturl"
                        className="text-sm text-zinc-400 font-medium hover:text-zinc-200 transition-colors"
                        prefetch={false}
                    >
                        About
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
