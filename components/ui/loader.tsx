import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CreativeLoader: React.FC<LoaderProps> = ({ className, size = 'lg' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
    };

    return (
        <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
            {/* Outer rotating ring with gradient */}
            <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-transparent border-t-primary border-r-secondary animate-spin" />

            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full border-l-4 border-b-4 border-transparent border-l-secondary border-b-primary animate-spin-reverse opacity-80" />

            {/* Inner glowing core */}
            <div className="absolute inset-center w-1/3 h-1/3 bg-gradient-to-tr from-primary to-secondary rounded-full animate-pulse shadow-[0_0_15px_rgba(255,171,0,0.5)]" />

            {/* Blur effect for depth */}
            <div className="absolute inset-0 rounded-full bg-secondary/10 blur-xl animate-pulse" />
        </div>
    );
};
