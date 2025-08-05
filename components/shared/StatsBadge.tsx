'use client';

import { NumberTicker } from '../magicui/number-ticker';

interface StatsBadgeProps {
    count: number | null;
    loading: boolean;
}

const StatsBadge = ({ count, loading }: StatsBadgeProps) => {
    if (loading) {
        return (
            <div className='w-[184.083px] flex justify-center items-center'>
                <div className='flex items-center space-x-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 text-sm text-zinc-300'>
                    <span className='font-semibold text-white animate-pulse'>
                        30,000
                    </span>
                    <span className='text-stone-400'>URLs Shortened</span>
                </div>
            </div>
        );
    }

    if (count === null) {
        return null;
    }

    return (
        <div className='w-[184.083px] flex justify-center items-center'>
            <div className='flex items-center space-x-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 text-sm text-zinc-300 transition-colors hover:bg-zinc-700/60'>
                <p className='font-semibold text-white'>
                    {new Intl.NumberFormat().format(count)}
                </p>
                <span className='text-stone-400'>URLs Shortened</span>
            </div>
        </div>
    );
};

export default StatsBadge;
