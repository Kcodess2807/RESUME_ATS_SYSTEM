import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all shadow-sm shrink-0 border border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

    const variants = {
        primary: "bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:-translate-y-1 hover:shadow-glow",
        accent: "bg-gradient-to-b from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white shadow-lg shadow-accent-500/30 hover:-translate-y-1 hover:shadow-glow-accent",
        ghost: "bg-surface/80 backdrop-blur-sm border-2 border-secondary-200 hover:border-secondary-300 hover:bg-background text-secondary-700 hover:-translate-y-0.5 !border-secondary-200",
        outline: "border-2 !border-primary-500 text-primary-600 hover:bg-primary-50",
        light: "bg-white text-secondary-900 hover:bg-secondary-50 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transform hover:-translate-y-1",
        danger: "bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg shadow-red-500/30 hover:-translate-y-1"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
