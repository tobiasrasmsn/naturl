'use client';

import { Button } from '@/components/ui/button';
import MagicInput from '@/components/ui/magic-input';
import { FormEvent, useState } from 'react';
import { CgSpinnerAlt, CgTerminal } from 'react-icons/cg';
import { toast } from 'sonner';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { FaLink } from 'react-icons/fa6';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
export default function Home() {
    const [url, setUrl] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [currentShortUrl, setCurrentShortUrl] = useState('');
    const [step, setStep] = useState(1);
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const handleNext = (e: FormEvent) => {
        e.preventDefault();
        if (isValidUrl(url)) {
            setStep(2);
        } else {
            toast.error('Please enter a valid URL', {
                description: 'The URL should start with http:// or https://',
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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, shortCode }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (data.success) {
                const shortUrl = `${window.location.origin}/${data.shortCode}`;
                setCurrentShortUrl(shortUrl);
                setShowConfetti(true);
                await navigator.clipboard.writeText(shortUrl);
                toast.success('Copied to clipboard');
                setTimeout(() => setShowConfetti(false), 5000);
            } else {
                if (response.status === 429) {
                    toast.error('Rate limit exceeded', {
                        description: 'Please try again later.',
                    });
                } else if (response.status === 400) {
                    toast.error('Invalid input', {
                        description:
                            data.error ||
                            'Please check your input and try again.',
                    });
                } else {
                    toast.error('Error', {
                        description:
                            data.error ||
                            'Failed to create short URL. Please try again.',
                    });
                }
            }
        } catch (error) {
            // If it's a network error, check if the URL was actually created
            if (error instanceof Error && error.name === 'TypeError') {
                try {
                    // Wait a moment before checking
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Check if the URL exists
                    const checkResponse = await fetch(`/api/check-url`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url }),
                    });

                    const checkData = await checkResponse.json();
                    if (checkData.exists) {
                        const shortUrl = `${window.location.origin}/${checkData.shortCode}`;
                        setCurrentShortUrl(shortUrl);
                        setShowConfetti(true);
                        await navigator.clipboard.writeText(shortUrl);
                        toast.success('URL shortened successfully');
                        setTimeout(() => setShowConfetti(false), 5000);
                        return;
                    }
                } catch (_) {
                    // If the check fails, show the original error
                }
            }

            console.error('Error', error);
            toast.error('Network error', {
                description:
                    'Failed to connect to the server. Please check your internet connection and try again.',
            });
        } finally {
            setIsUrlLoading(false);
        }
    };

    async function handleCopy() {
        if (currentShortUrl) {
            await navigator.clipboard.writeText(currentShortUrl);
            toast.success('Copied to clipboard', {
                description: 'The short URL has been copied to your clipboard.',
            });
        }
    }
    const resetStates = () => {
        setUrl('');
        setShortCode('');
        setCurrentShortUrl('');
        setStep(1);
    };
    return (
        <main className='bg-zinc-950'>
            <section className='w-full h-[100dvh] min-h-[500px] flex flex-col justify-center items-center gap-5 '>
                <div className='flex flex-col justify-center items-center gap-5 absolute z-30 '>
                    <Link
                        href='https://buymeacoffee.com/tobiasr'
                        target='_blank'
                        className={cn(
                            'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                        )}
                    >
                        <AnimatedShinyText className='inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400'>
                            <span className='text-sm'>
                                ✨ Support this project
                            </span>
                            <ArrowRightIcon className='ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
                        </AnimatedShinyText>
                    </Link>
                    <h1 className='text-[10vw] leading-[10vw] md:leading-[1] lg:leading-[1] md:text-4xl lg:text-5xl font-semibold text-center text-zinc-100'>
                        Naturally short, <br />
                        Perfectly linked.
                    </h1>
                    <form className='flex flex-col items-center gap-2 w-full'>
                        {currentShortUrl ? (
                            <>
                                <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
                                    <MagicInput
                                        type='text'
                                        value={currentShortUrl}
                                        readOnly
                                        onClick={handleCopy}
                                        aria-label='Short URL'
                                        className='w-full cursor-pointer'
                                    />
                                    <Button
                                        type='button'
                                        onClick={handleCopy}
                                        aria-label='Copy'
                                        className='bg-purple-700/45 transition-colors duration-300 backdrop-blur-2xl h-[44px] text-sm border w-full sm:w-[126.95px] text-purple-100 border-purple-400/45 hover:opacity-100 hover:bg-purple-700 hover:border-purple-400 flex flex-row justify-center items-center gap-3'
                                    >
                                        <FaLink className='' /> Copy
                                    </Button>
                                </div>
                                <button
                                    type='button'
                                    onClick={resetStates}
                                    aria-label='Create new'
                                    className='absolute -bottom-8 text-zinc-400 text-sm hover:text-zinc-200 transition-colors'
                                >
                                    Create new
                                </button>
                            </>
                        ) : (
                            <>
                                {step === 1 ? (
                                    <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
                                        <MagicInput
                                            type='url'
                                            placeholder='Long URL here...'
                                            value={url}
                                            onChange={(e) =>
                                                setUrl(e.target.value)
                                            }
                                            required
                                            aria-label='Long URL'
                                            className='w-full'
                                        />
                                        <Button
                                            type='button'
                                            onClick={handleNext}
                                            aria-label='Next'
                                            className='bg-purple-700/45 transition-colors duration-300 backdrop-blur-2xl h-[44px] text-sm border w-full sm:w-[126.95px] text-purple-100 border-purple-400/45 hover:opacity-100 hover:bg-purple-700 hover:border-purple-400 flex flex-row justify-center items-center gap-3'
                                        >
                                            Next
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
                                        <MagicInput
                                            type='text'
                                            placeholder='Custom short code (optional)'
                                            value={shortCode}
                                            onChange={(e) =>
                                                setShortCode(e.target.value)
                                            }
                                            maxLength={15}
                                            aria-label='Custom short code'
                                            className='w-full'
                                        />
                                        <Button
                                            type='submit'
                                            onClick={shortenUrl}
                                            aria-label='Shorten URL'
                                            className='bg-purple-700/45 transition-colors duration-300 backdrop-blur-2xl border h-[44px] text-sm w-full sm:w-[126.95px] text-purple-100 border-purple-400/45 hover:opacity-100 hover:bg-purple-700 hover:border-purple-400 flex flex-row justify-center items-center gap-3'
                                        >
                                            {isUrlLoading ? (
                                                <CgSpinnerAlt className='text-zinc-100 animate-spin' />
                                            ) : (
                                                'Shorten'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </form>
                </div>
                <Link
                    href='/terms'
                    className='text-zinc-800 text-xs hover:text-zinc-200 transition-colors absolute bottom-8 left-1/2 -translate-x-1/2 text-center'
                >
                    By using Naturl, you agree to our Terms of Service
                </Link>
            </section>

            {showConfetti && (
                <div className='fixed inset-0 z-50 pointer-events-none'>
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
