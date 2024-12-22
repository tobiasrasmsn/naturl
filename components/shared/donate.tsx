'use client';
import { useEffect, useState } from 'react';

export default function Donate() {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasClosedPopup = localStorage.getItem('donatePopupClosed');

        if (!hasClosedPopup) {
            setShowPopup(true);
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
        localStorage.setItem('donatePopupClosed', 'true');
    };

    if (!showPopup) return null;

    return (
        <div className='p-4 md:p-0'>
            <div className='fixed bottom-0 md:bottom-4 right-0 md:right-4 w-full md:w-[300px] bg-zinc-900 rounded-none md:rounded-lg shadow-lg p-4 border border-zinc-800 animate-fade-in z-[100]'>
                <button
                    onClick={handleClose}
                    className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg'
                    aria-label='Close donate popup'
                >
                    ×
                </button>

                <div className='space-y-3'>
                    <h3 className='font-semibold text-sm text-zinc-100'>
                        Support This Project
                    </h3>
                    <p className='text-xs text-zinc-400'>
                        This URL shortener is provided completely free, with no
                        sign-up required. If you find it useful, consider buying
                        me a coffee!
                    </p>
                    <a
                        href='https://buymeacoffee.com/tobiasr'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-block text-sm bg-purple-600 text-black font-medium px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full text-center'
                    >
                        Buy me a coffee
                    </a>
                </div>
            </div>
        </div>
    );
}
