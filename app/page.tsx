'use client';

import { Button } from '@/components/ui/button';
import MagicInput from '@/components/ui/magic-input';
import { FormEvent, useState } from 'react';
import { CgSpinnerAlt, CgTerminal } from 'react-icons/cg';
import { toast } from 'sonner';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { FaLink } from 'react-icons/fa6';
export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
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
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, shortCode }),
            });

            const data = await response.json();
            console.log('Response data:', data);

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
                    <h1 className='text-[10vw] leading-[10vw] md:leading-[1] lg:leading-[1] md:text-6xl lg:text-7xl font-semibold text-center text-zinc-100'>
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
                                        className='w-full cursor-pointer'
                                    />
                                    <Button
                                        type='button'
                                        onClick={handleCopy}
                                        className='bg-purple-700/45 transition-colors duration-300 backdrop-blur-2xl h-[50px] text-base border w-full sm:w-[126.95px] text-purple-100 border-purple-400/45 hover:opacity-100 hover:bg-purple-700 hover:border-purple-400 flex flex-row justify-center items-center gap-3'
                                    >
                                        <FaLink className='' /> Copy
                                    </Button>
                                </div>
                                <button
                                    type='button'
                                    onClick={resetStates}
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
                                            className='w-full'
                                        />
                                        <Button
                                            type='button'
                                            onClick={handleNext}
                                            className='bg-purple-700/45 transition-colors duration-300 backdrop-blur-2xl h-[50px] text-base border w-full sm:w-[126.95px] text-purple-100 border-purple-400/45 hover:opacity-100 hover:bg-purple-700 hover:border-purple-400 flex flex-row justify-center items-center gap-3'
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
                                            className='w-full'
                                        />
                                        <Button
                                            type='submit'
                                            onClick={shortenUrl}
                                            className='bg-purple-700/45 transition-colors duration-300 backdrop-blur-2xl border h-[50px] text-base w-full sm:w-[126.95px] text-purple-100 border-purple-400/45 hover:opacity-100 hover:bg-purple-700 hover:border-purple-400 flex flex-row justify-center items-center gap-3'
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
