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
        <div className='fixed bottom-4 right-4 max-w-[300px] bg-zinc-900 rounded-lg shadow-lg p-4 border border-zinc-800 animate-fade-in z-[100]'>
            <button
                onClick={handleClose}
                className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
                aria-label='Close donate popup'
            >
                ×
            </button>

            <div className='space-y-3'>
                <h3 className='font-semibold text-lg text-zinc-100'>
                    Support This Project
                </h3>
                <p className='text-sm text-zinc-400'>
                    This URL shortener is provided completely free, with no
                    sign-up required. If you find it useful, consider buying me
                    a coffee!
                </p>
                <a
                    href='https://buymeacoffee.com/tobiasr'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block bg-[#FFDD00] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#FFDD00]/90 transition-colors w-full text-center'
                >
                    ☕ Buy me a coffee
                </a>
            </div>
        </div>
    );
}
