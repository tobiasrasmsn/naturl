"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, FormEvent } from "react";

export default function Shorten() {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");

    const shortenUrl = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
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
                setShortUrl(`${window.location.origin}/${data.shortCode}`);
            } else {
                throw new Error(data.error || "Failed to create short URL");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to create short URL. Please try again.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">URL Shortener</h1>
                </CardHeader>
                <CardContent>
                    <form onSubmit={shortenUrl} className="space-y-4">
                        <Input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL to shorten"
                            required
                        />
                        <Button type="submit">Shorten</Button>
                    </form>
                    {shortUrl && (
                        <Alert variant="default" className="mt-4">
                            Short URL: <a href={shortUrl}>{shortUrl}</a>
                        </Alert>
                    )}
                    {error && (
                        <Alert variant="destructive" className="mt-4">
                            {error}
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-gray-500">
                        Enter a long URL above to generate a shortened link.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
