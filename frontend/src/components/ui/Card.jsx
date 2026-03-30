import React from 'react';

export default function Card({ children, className = '', hover = false, ...props }) {
    const hoverStyles = hover ? "hover:shadow-md transition-all hover:border-primary-100 hover:-translate-y-1 duration-300" : "";
    return (
        <div
            className={`bg-surface rounded-2xl shadow-soft border border-secondary-100 overflow-hidden ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
