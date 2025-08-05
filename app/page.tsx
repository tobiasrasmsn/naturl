'use client';

import { FormEvent, useState, useEffect } from 'react';
import {
    CgCheckO,
    CgCommunity,
    CgSpinnerAlt,
    CgTerminal,
} from 'react-icons/cg';
import { toast } from 'sonner';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import {
    FaLink,
    FaHandshake,
    FaHandSparkles,
    FaArrowUp,
    FaArrowDown,
} from 'react-icons/fa6';
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
import StatsBadge from '@/components/shared/StatsBadge';
import { v4 as uuidv4 } from 'uuid';

interface Idea {
    id: number;
    content: string;
    author_id: string;
    created_at: string;
    votes: number;
}

export default function Home() {
    const [url, setUrl] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [currentShortUrl, setCurrentShortUrl] = useState('');
    const [step, setStep] = useState(1);
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const [showSponsorBox, setShowSponsorBox] = useState(true);
    const [idea, setIdea] = useState('');
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [authorId, setAuthorId] = useState('');
    const [votedIdeas, setVotedIdeas] = useState<{
        [key: number]: 'upvote' | 'downvote';
    }>({});
    const [urlCount, setUrlCount] = useState<number | null>(null);
    const [isCountLoading, setIsCountLoading] = useState(true);

    useEffect(() => {
        let storedAuthorId = localStorage.getItem('authorId');
        if (!storedAuthorId) {
            storedAuthorId = uuidv4();
            localStorage.setItem('authorId', storedAuthorId);
        }
        setAuthorId(storedAuthorId);

        const fetchIdeas = async () => {
            try {
                const response = await fetch('/api/ideas');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setIdeas(data);
                }
            } catch (error) {
                console.error('Failed to fetch ideas', error);
            }
        };

        fetchIdeas();

        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();
                setUrlCount(data.count);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setIsCountLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleVote = async (
        ideaId: number,
        voteType: 'upvote' | 'downvote'
    ) => {
        try {
            const response = await fetch('/api/ideas/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idea_id: ideaId,
                    vote_type: voteType,
                    author_id: authorId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setIdeas(
                    ideas.map((idea) =>
                        idea.id === ideaId
                            ? { ...idea, votes: data.votes }
                            : idea
                    )
                );
                setVotedIdeas({ ...votedIdeas, [ideaId]: voteType });
            } else {
                toast.error(data.error || 'Failed to vote.');
            }
        } catch (error) {
            toast.error('An error occurred while voting.');
        }
    };

    const handleIdeaSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (idea.trim() && authorId) {
            try {
                const response = await fetch('/api/ideas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: idea,
                        author_id: authorId,
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    toast.success('Thank you for your suggestion!');
                    setIdeas([data.idea, ...ideas]);
                    setIdea('');
                } else {
                    toast.error(data.error || 'Failed to submit your idea.');
                }
            } catch (error) {
                toast.error('An error occurred while submitting your idea.');
            }
        } else if (!idea.trim()) {
            toast.error('Please enter an idea before submitting.');
        }
    };
    useEffect(() => {
        const isClosed = localStorage.getItem('sponsorBoxClosed') === 'true';
        setShowSponsorBox(!isClosed);
    }, []);

    const handleCloseSponsorBox = () => {
        setShowSponsorBox(false);
        localStorage.setItem('sponsorBoxClosed', 'true');
    };

    const totalDonation = 300;
    const currentDonation = 15;
    const progressPercentage = (currentDonation / totalDonation) * 100;

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
                if (
                    !data.message ||
                    !data.message.includes('already created')
                ) {
                    setUrlCount((prevCount) =>
                        prevCount !== null ? prevCount + 1 : 1
                    );
                }
                const shortUrl = `${window.location.origin}/${data.shortCode}`;
                setCurrentShortUrl(shortUrl);
                setShowConfetti(true);
                try {
                    await navigator.clipboard.writeText(shortUrl);
                    toast.success('Copied to clipboard');
                } catch (err) {
                    console.error('Failed to copy to clipboard', err);
                }
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
                <div className='absolute top-0 min-w-0 left-0 w-full h-full z-10 pointer-events-none'>
                    <Image
                        src='/imgs/bg_2.avif'
                        alt='Background'
                        fill
                        className='object-cover min-w-0'
                        style={{
                            maskImage:
                                'linear-gradient(to bottom, black 10%, transparent 100%)',
                            WebkitMaskImage:
                                'linear-gradient(to bottom, black 10%, transparent 100%)',
                        }}
                        priority
                    />
                </div>
                <div className='flex flex-col justify-center items-center gap-5 absolute z-30 px-4 sm:px-0'>
                    {/*<Link
                        href='https://buymeacoffee.com/tobiasr'
                        target='_blank'
                        className={cn(
                            'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-zinc-900 dark:hover:bg-zinc-800'
                        )}
                    >
                        <AnimatedShinyText className='inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-zinc-600 hover:duration-300 hover:dark:text-zinc-400'>
                            <span className='text-sm'>
                                ✨ Support this project
                            </span>
                            <ArrowRightIcon className='ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
                        </AnimatedShinyText>
                    </Link>*/}
                    <StatsBadge count={urlCount} loading={isCountLoading} />
                    <h1 className='text-[11.5vw] leading-[11.5vw] md:leading-[1] lg:leading-[1] md:text-5xl lg:text-[3.25rem] font-semibold text-center text-zinc-100'>
                        Naturally short, <br />
                        Perfectly linked.
                    </h1>

                    <form className='flex flex-col items-center gap-2 w-full'>
                        {currentShortUrl ? (
                            <>
                                <div className='w-full sm:w-[400px] rounded-full group focus-within:border-zinc-700 focus-within:bg-zinc-900 shadow-inner shadow-zinc-400/10 transition-all duration-300 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 flex flex-row items-center gap-2 p-2'>
                                    <input
                                        type='text'
                                        value={currentShortUrl}
                                        readOnly
                                        onClick={handleCopy}
                                        aria-label='Short URL'
                                        className='w-full text-base  text-zinc-100 focus:outline-none focus:ring-0 bg-transparent px-4 py-2 cursor-pointer'
                                    />
                                    <button
                                        type='button'
                                        onClick={handleCopy}
                                        aria-label='Copy'
                                        className='bg-gradient-to-tr from-blue-600 to-blue-500 hover:contrast-150 transition-all duration-300 shadow-inner shadow-blue-300/30 w-[100px] text-sm rounded-full px-3 py-2 text-zinc-100 flex items-center justify-center gap-2'
                                    >
                                        <FaLink /> Copy
                                    </button>
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
                                    <div className='w-full sm:w-[400px] rounded-full group focus-within:border-zinc-700/60 focus-within:bg-zinc-900 shadow-inner shadow-zinc-400/10 transition-all duration-300 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 flex flex-row items-center gap-2 p-2'>
                                        <input
                                            type='url'
                                            placeholder='Long URL here...'
                                            className='w-full text-base  text-zinc-100 focus:outline-none focus:ring-0 bg-transparent px-4 py-2'
                                            value={url}
                                            onChange={(e) =>
                                                setUrl(e.target.value)
                                            }
                                            required
                                            aria-label='Long URL'
                                        />
                                        <button
                                            type='button'
                                            onClick={handleNext}
                                            aria-label='Next'
                                            className='bg-gradient-to-tr from-blue-600 to-blue-500 hover:contrast-150 transition-all duration-300 shadow-inner shadow-blue-300/30 w-[100px] text-sm rounded-full px-3 py-2 text-zinc-100'
                                        >
                                            Next
                                        </button>
                                    </div>
                                ) : (
                                    <div className='w-full sm:w-[400px] rounded-full group focus-within:border-zinc-700 focus-within:bg-zinc-900 shadow-inner shadow-zinc-400/10 transition-all duration-300 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 flex flex-row items-center gap-2 p-2'>
                                        <input
                                            type='text'
                                            placeholder='Custom short code (optional)'
                                            className='w-full text-base  text-zinc-100 focus:outline-none focus:ring-0 bg-transparent px-4 py-2'
                                            value={shortCode}
                                            onChange={(e) =>
                                                setShortCode(e.target.value)
                                            }
                                            maxLength={15}
                                            aria-label='Custom short code'
                                        />
                                        <button
                                            type='submit'
                                            onClick={shortenUrl}
                                            aria-label='Shorten URL'
                                            className='bg-gradient-to-tr h-[36px] from-blue-600 to-blue-500 hover:contrast-150 transition-all duration-300 shadow-inner shadow-blue-300/30 w-[100px] text-sm rounded-full px-3 py-2 text-zinc-100 flex items-center justify-center'
                                        >
                                            {isUrlLoading ? (
                                                <CgSpinnerAlt className='text-zinc-100 animate-spin' />
                                            ) : (
                                                'Shorten'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </form>

                    <Link
                        href='/terms'
                        className='text-zinc-400 text-xs hover:text-zinc-200 transition-colors text-center'
                    >
                        By using Naturl, you agree to our Terms of Service
                    </Link>
                </div>
            </section>
            {/* Features 
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
            </section>*/}
            {/* Community Driven
            <section className='w-full py-24 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900'>
                <div className='max-w-4xl mx-auto px-6'>
                    <div className='text-center mb-16'>
                        <div className='inline-flex items-center justify-center px-4 py-2 mb-6 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full'>
                            <span className='text-sm font-medium text-blue-400'>
                                Community Driven
                            </span>
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-zinc-100 mb-4 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-300 bg-clip-text text-transparent'>
                            Got an Idea for a Tool?
                        </h2>
                        <p className='text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed'>
                            We are always looking to build new tools that our
                            users will love. Share your ideas and help us create
                            the perfect toolkit for everyone.
                        </p>
                    </div>

                    <div className='max-w-2xl mx-auto'>
                        <div className='bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl shadow-zinc-950/50 overflow-hidden'>
                            
                            <div className='bg-gradient-to-r from-zinc-800 to-zinc-700 px-6 py-4 border-b border-zinc-600/50'>
                                <div className='flex items-center gap-3'>
                                    <CgCommunity className='w-4 h-4 text-zinc-200' />
                                    <h3 className='text-zinc-200 font-semibold text-sm '>
                                        Community Ideas
                                    </h3>
                                </div>
                            </div>

                            <div className='p-6 space-y-4 h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent'>
                                {ideas.map((idea) => (
                                    <div
                                        key={idea.id}
                                        className={`rounded-2xl p-4 max-w-[85%] shadow-lg border ${
                                            idea.author_id === authorId
                                                ? 'bg-gradient-to-r from-blue-600/20 to-blue-600/20 rounded-br-md border-blue-500/30 ml-auto'
                                                : 'bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 rounded-bl-md border-zinc-600/30'
                                        }`}
                                    >
                                        <p className='text-zinc-100 text-sm leading-relaxed'>
                                            {idea.content}
                                        </p>
                                        <div className='flex items-center justify-between mt-2'>
                                            <div
                                                className={`text-xs ${
                                                    idea.author_id === authorId
                                                        ? 'text-blue-300'
                                                        : 'text-zinc-400'
                                                }`}
                                            >
                                                {idea.author_id === authorId
                                                    ? 'You'
                                                    : 'Naturl User'}
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() =>
                                                        handleVote(
                                                            idea.id,
                                                            'upvote'
                                                        )
                                                    }
                                                    disabled={
                                                        votedIdeas[idea.id] ===
                                                        'upvote'
                                                    }
                                                    className='text-zinc-400 hover:text-white disabled:text-green-500'
                                                >
                                                    <FaArrowUp />
                                                </button>
                                                <span className='text-xs text-zinc-300'>
                                                    {idea.votes}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleVote(
                                                            idea.id,
                                                            'downvote'
                                                        )
                                                    }
                                                    disabled={
                                                        votedIdeas[idea.id] ===
                                                        'downvote'
                                                    }
                                                    className='text-zinc-400 hover:text-white disabled:text-red-500'
                                                >
                                                    <FaArrowDown />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='p-4 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 border-t border-zinc-600/50'>
                                <form
                                    onSubmit={handleIdeaSubmit}
                                    className='flex items-center gap-3'
                                >
                                    <div className='flex-1 relative'>
                                        <input
                                            type='text'
                                            placeholder='Share your brilliant idea...'
                                            className='w-full bg-zinc-800/80 border border-zinc-600/50 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 placeholder:text-zinc-500'
                                            value={idea}
                                            onChange={(e) =>
                                                setIdea(e.target.value)
                                            }
                                            aria-label='Idea for a tool'
                                        />
                                    </div>
                                    <button
                                        type='submit'
                                        aria-label='Send idea'
                                        className='bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 shadow-inner shadow-blue-300/30 text-sm rounded-xl px-6 py-3 text-white font-medium flex items-center gap-2 group'
                                    >
                                        <span>Send</span>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className='text-center mt-8'>
                            <p className='text-zinc-500 text-sm'>
                                Your ideas help shape the future of our platform
                                ✨
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

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
