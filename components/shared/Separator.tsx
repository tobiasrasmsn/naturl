interface SeparatorProps {
    className?: string;
}
export default function Separator({ className }: SeparatorProps) {
    return (
        <div className={`${className}`}>
            <div
                className={`h-[1px] bg-gradient-to-r from-zinc-950 via-zinc-500 to-zinc-950 w-full`}
            ></div>
        </div>
    );
}
