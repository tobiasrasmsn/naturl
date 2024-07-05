import React, { useState, InputHTMLAttributes } from "react";

interface MagicInputProps extends InputHTMLAttributes<HTMLInputElement> {
    // You can add any additional custom props here if needed
}

const MagicInput: React.FC<MagicInputProps> = ({ className, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full h-[42px] overflow-hidden rounded-md p-[1px]">
            {isFocused && (
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            )}
            <input
                {...props}
                className={`
          relative w-full h-full rounded-md bg-zinc-900/75 focus:bg-zinc-900/95 px-3 py-1 
          text-sm text-white backdrop-blur-xl
          focus:outline-none border border-zinc-800
          ${isFocused ? "shadow-[0_0_0_1px_rgba(226,203,255,0.5)]" : ""}
          transition-shadow duration-300 ease-in-out
          ${className || ""}
        `}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
            />
        </div>
    );
};

export default MagicInput;
