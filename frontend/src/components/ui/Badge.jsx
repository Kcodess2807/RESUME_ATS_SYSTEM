import React from 'react';

export default function Badge({ children, variant = 'primary', className = '' }) {
    const variants = {
        primary: "bg-primary-50 border border-primary-100/50 text-primary-700",
        accent: "bg-accent-50 border border-accent-100/50 text-accent-700",
        secondary: "bg-secondary-50 border border-secondary-100/50 text-secondary-700",
        danger: "bg-red-50 border border-red-100/50 text-red-700",
        warning: "bg-amber-50 border border-amber-100/50 text-amber-700",
        info: "bg-blue-50 border border-blue-100/50 text-blue-700",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold rounded-lg ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
