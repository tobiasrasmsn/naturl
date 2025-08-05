'use client';

import Image from 'next/image';
import { LockClosedIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function BlockedPage() {
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
                <div className='flex flex-col justify-center items-center gap-5 absolute z-30 px-4 sm:px-0 text-center'>
                    <div className='p-4 bg-red-500/10 rounded-full border border-red-500/20'>
                        <LockClosedIcon className='h-8 w-8 text-red-500' />
                    </div>
                    <h1 className='text-[11.5vw] leading-[11.5vw] md:leading-[1] lg:leading-[1] md:text-5xl lg:text-[3.25rem] font-semibold text-zinc-100'>
                        Link Blocked
                    </h1>
                    <p className='text-zinc-400 max-w-md'>
                        The link you are trying to access has been blocked
                        because it may violate our{' '}
                        <Link
                            href='/terms'
                            className='text-zinc-100 hover:underline'
                        >
                            Terms of Service
                        </Link>
                        .
                    </p>
                    <Link
                        href='/'
                        className='mt-4 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 hover:contrast-150 transition-all duration-300 shadow-inner shadow-blue-300/30 px-6 py-2 text-zinc-100 text-sm'
                    >
                        Go back to Homepage
                    </Link>
                </div>
            </section>
        </main>
    );
}
