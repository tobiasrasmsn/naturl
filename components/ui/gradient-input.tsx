import React, { useState, InputHTMLAttributes } from "react";

interface GradientInputProps extends InputHTMLAttributes<HTMLInputElement> {
    // You can add any additional custom props here if needed
}

const GradientInput: React.FC<GradientInputProps> = ({
    className,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full">
            <div
                className={`
          absolute inset-0 rounded-md
          ${isFocused ? "opacity-100" : "opacity-0"}
          transition-opacity duration-800
          bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x
        `}
            />
            <input
                {...props}
                className={`
          w-full bg-zinc-900/55 backdrop-blur-sm text-zinc-300 
          border border-zinc-800/65 rounded-md
          px-4 py-2 text-base
          relative z-10
          focus:outline-none focus:border-transparent
          ${isFocused ? "shadow-[0_0_0_2px_rgba(0,0,0,0.1)]" : ""}
          transition-shadow duration-800
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

export default GradientInput;
