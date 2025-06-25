'use client';

import { Button } from '@/components/ui/button';
import MagicInput from '@/components/ui/magic-input';
import { FormEvent, useState, useEffect } from 'react';
import { CgCheckO, CgSpinnerAlt, CgTerminal } from 'react-icons/cg';
import { toast } from 'sonner';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { FaLink, FaHandshake, FaHandSparkles } from 'react-icons/fa6';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { cn } from '@/lib/utils';
import {
    ArrowRightIcon,
    BoxIcon,
    LockClosedIcon,
    MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import Image from 'next/image';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { RxCross2 } from 'react-icons/rx';
import Ad from '@/components/shared/ad';

export default function Home() {
    const [url, setUrl] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [currentShortUrl, setCurrentShortUrl] = useState('');
    const [step, setStep] = useState(1);
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const [showSponsorBox, setShowSponsorBox] = useState(true);

    useEffect(() => {
        const isClosed = localStorage.getItem('sponsorBoxClosed') === 'true';
        setShowSponsorBox(!isClosed);
    }, []);

    const handleCloseSponsorBox = () => {
        setShowSponsorBox(false);
        localStorage.setItem('sponsorBoxClosed', 'true');
    };

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
                    <Link
                        href='/terms'
                        className='text-zinc-800 text-xs hover:text-zinc-200 transition-colors text-center'
                    >
                        By using Naturl, you agree to our Terms of Service
                    </Link>
                </div>
            </section>
            <section className='w-full hidden lg:block'>
                <div className='bg-zinc-900/20 p-8 border-y border-zinc-800 flex flex-col items-center justify-center gap-5'>
                    <ul className='grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 '>
                        <GridItem
                            area='md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]'
                            icon={
                                <BoxIcon className='h-4 w-4 text-black dark:text-neutral-400' />
                            }
                            title='Free & Simple'
                            description="No sign-up required. Just paste your long URL and get a shortened link instantly. It's that simple!"
                        />

                        <GridItem
                            area='md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]'
                            icon={
                                <CgCheckO className='h-4 w-4 text-black dark:text-neutral-400' />
                            }
                            title='Custom Short Codes'
                            description='Create memorable links with your own custom short codes. Make your URLs both shorter and meaningful.'
                        />

                        <GridItem
                            area='md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]'
                            icon={
                                <LockClosedIcon className='h-4 w-4 text-black dark:text-neutral-400' />
                            }
                            title='Secure & Reliable'
                            description='Your links are safe with us. We use HTTPS encryption and maintain high availability for all shortened URLs.'
                        />

                        <GridItem
                            area='md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]'
                            icon={
                                <FaHandSparkles className='h-4 w-4 text-black dark:text-neutral-400' />
                            }
                            title='Lightning Fast'
                            description='Instant redirects and quick link generation. Your shortened URLs are ready to share in seconds.'
                        />

                        <GridItem
                            area='md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]'
                            icon={
                                <MagnifyingGlassIcon className='h-4 w-4 text-black dark:text-neutral-400' />
                            }
                            title='No Hidden Limits'
                            description='Create as many short links as you need. Our service is designed to be generous and user-friendly.'
                        />
                    </ul>
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
            <Ad />
        </main>
    );
}
interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={`min-h-[14rem] list-none ${area}`}>
            <div className='relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3'>
                <GlowingEffect
                    blur={0}
                    borderWidth={3}
                    spread={80}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                <div className='relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6'>
                    <div className='relative flex flex-1 flex-col justify-between gap-3'>
                        <div className='w-fit rounded-lg border border-gray-600 p-2 '>
                            {icon}
                        </div>
                        <div className='space-y-3'>
                            <h3 className='pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] text-balance text-black dark:text-white'>
                                {title}
                            </h3>
                            <h2
                                className='[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm/[1.125rem] 
              md:text-base/[1.375rem]  text-black dark:text-neutral-400'
                            >
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
