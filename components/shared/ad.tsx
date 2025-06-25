'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Ad() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check if ad was previously closed
        const adClosed = localStorage.getItem('ad-closed');
        if (adClosed !== 'true') {
            setIsVisible(true);
        }
        setIsLoaded(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Save to localStorage after animation completes
        setTimeout(() => {
            localStorage.setItem('ad-closed', 'true');
        }, 300);
    };

    // Don't render until we've checked localStorage
    if (!isLoaded) {
        return null;
    }

    return (
        <AnimatePresence mode='wait'>
            {isVisible && (
                <motion.div
                    initial={{
                        y: 100,
                        x: '-50%',
                        opacity: 0,
                        filter: 'blur(12px)',
                    }}
                    animate={{
                        y: 0,
                        x: '-50%',
                        opacity: 1,
                        filter: 'blur(0px)',
                    }}
                    exit={{
                        y: 100,
                        x: '-50%',
                        opacity: 0,
                        filter: 'blur(12px)',
                    }}
                    transition={{
                        type: 'easeInOut',
                        duration: 0.5,
                    }}
                    className='fixed w-[310px] bottom-4 left-1/2 z-50 bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2'
                >
                    <div className='flex flex-row items-start gap-4'>
                        <div className='w-12 h-12 rounded-md relative mt-5'>
                            <Image
                                src='/imgs/modelary_icon.png'
                                alt='ad'
                                fill
                                className='rounded-md object-cover shrink-0'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <h4 className='text-zinc-400 text-xs'>
                                Advertisement
                            </h4>
                            <h2 className='text-white text-base font-bold'>
                                Modelary
                            </h2>
                            <p className='text-zinc-400 text-xs max-w-[200px] text-pretty'>
                                Chat with AI models, generate images, and use
                                personas - all in one platform.
                            </p>
                            <div className='flex flex-row gap-2 mt-3 w-full justify-between relative'>
                                <Link
                                    href='https://www.modelary.app'
                                    target='_blank'
                                >
                                    <button className='bg-gradient-to-tr from-blue-700 to-blue-500 border border-blue-500/35 transition-all duration-300 hover:brightness-125 shadow-inner shadow-blue-200/35 w-[100px] font-semibold text-white text-xs px-4 py-1 md:py-2 rounded-md'>
                                        Visit
                                    </button>
                                </Link>
                                <button
                                    onClick={handleClose}
                                    className='bg-zinc-800 hover:bg-zinc-700 transition-colors w-full text-white md:text-xs px-4 py-1 md:py-2 rounded-md'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
