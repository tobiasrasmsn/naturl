import Link from "next/link";
import { Button } from "../ui/button";

export default function Navigation() {
    return (
        <header className="py-4 px-12 w-full fixed z-50">
            <div className="w-full p-3 flex flex-row justify-between items-center bg-zinc-950/50 backdrop-blur-xl rounded-lg border border-zinc-900">
                <h2 className="font-semibold text-zinc-100 text-lg">Naturl</h2>
                <nav>
                    <ul className="text-sm flex text-zinc-100 flex-row gap-3 items-center">
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Button asChild>
                                <Link href="/">Shorten URL</Link>
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
