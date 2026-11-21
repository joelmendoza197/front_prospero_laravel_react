// src/components/ui/Button.jsx
import React from 'react';

export const Button = ({ children, type = "button", className = '', ...props }) => {
    return (
        <button 
            type={type}
            {...props} 
            className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 
            active:scale-[0.98] shadow-lg
            bg-brand-panel text-white 
            hover:bg-black dark:hover:bg-black
            ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};