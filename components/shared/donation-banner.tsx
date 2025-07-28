import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export default function Component() {
    const raised = 25;
    const goal = 300;
    const progressPercentage = (raised / goal) * 100;

    return (
        <Card className='w-full rounded-t-none md:rounded-t-lg fixed bottom-0 md:bottom-5 left-0 right-0 z-50 max-w-4xl mx-auto border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50'>
            <CardContent className='p-3'>
                {/* Mobile Layout */}
                <div className='flex flex-col gap-2 sm:hidden'>
                    <div className='flex items-center gap-2'>
                        <HeartFilledIcon className='w-4 h-4 text-amber-600 flex-shrink-0' />
                        <span className='text-gray-700 text-sm'>
                            <strong>Naturl needs support!</strong> Without
                            donations, we&apos;ll shut down by September 2025.
                        </span>
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-2 w-full'>
                            <Progress
                                value={progressPercentage}
                                className='h-2 w-full'
                            />
                            <span className='text-xs text-gray-600 whitespace-nowrap'>
                                ${raised}/${goal}
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Popover>
                                <PopoverTrigger>
                                    <Button
                                        size='sm'
                                        className='bg-orange-300 hover:bg-orange-700 text-xs !py-2 !h-fit !text-white rounded-full'
                                    >
                                        Contact
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <p>
                                        For alternative payment methods:{' '}
                                        <span className='text-blue-400 hover:text-blue-300 transition-colors [text-shadow:0_0_8px_rgba(59,130,246,0.95)] hover:contrast-125'>
                                            naturl@rasmussensolutions.no
                                        </span>
                                    </p>
                                </PopoverContent>
                            </Popover>
                            <Button
                                size='sm'
                                asChild
                                className='bg-orange-600 hover:bg-orange-700 text-xs !py-2 !h-fit !text-white rounded-full'
                            >
                                <Link
                                    href='https://buymeacoffee.com/tobiasr'
                                    target='_blank'
                                >
                                    Donate
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className='hidden sm:flex flex-col gap-3'>
                    <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-2'>
                            <HeartFilledIcon className='w-4 h-4 text-amber-600 flex-shrink-0' />
                            <span className='text-gray-700'>
                                <strong>Naturl needs support!</strong> Without
                                donations, we&apos;ll shut down by September
                                2025.
                            </span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Popover>
                                <PopoverTrigger>
                                    <Button
                                        size='sm'
                                        className='bg-orange-300 hover:bg-orange-700 text-white rounded-full'
                                    >
                                        Contact
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <p>
                                        For alternative payment methods:{' '}
                                        <span className='text-blue-400 hover:text-blue-300 transition-colors [text-shadow:0_0_8px_rgba(59,130,246,0.95)] hover:contrast-125'>
                                            naturl@rasmussensolutions.no
                                        </span>
                                    </p>
                                </PopoverContent>
                            </Popover>
                            <Button
                                size='sm'
                                asChild
                                className='bg-orange-600 hover:bg-orange-700 text-white rounded-full'
                            >
                                <Link
                                    href='https://buymeacoffee.com/tobiasr'
                                    target='_blank'
                                >
                                    Donate
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Progress
                            value={progressPercentage}
                            className='h-2 w-full'
                        />
                        <span className='text-xs text-gray-600 whitespace-nowrap'>
                            ${raised}/${goal}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
