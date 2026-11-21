// src/components/ui/Input.jsx
import React from 'react';
import { Mail, Lock, Eye } from 'lucide-react';

export const Input = ({ 
    label, 
    error, 
    type, 
    name, 
    placeholder, 
    showForgotPassword = false, // Propiedad nueva, por defecto desactivada
    ...props 
}) => {
    const isPassword = type === 'password';
    
    return (
        <div className="w-full mb-5 text-left">
            <div className="flex justify-between items-end mb-1.5">
                {label && <label className="text-sm font-bold text-gray-800">{label}</label>}
                
                {/* Solo se muestra si es password Y si la prop es true */}
                {isPassword && showForgotPassword && (
                    <a href="#" className="text-xs font-bold text-green-700 hover:underline">
                        ¿Olvidaste tu contraseña?
                    </a>
                )}
            </div>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                    {type === 'email' ? <Mail size={18} /> : <Lock size={18} />}
                </div>
                <input 
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className={`w-full pl-11 pr-10 py-3.5 bg-white/50 border rounded-xl outline-none transition-all
                    ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black focus:bg-white shadow-sm'}`}
                    {...props}
                />
            </div>
            {error && <p className="text-red-600 text-xs mt-1.5 font-bold">{error[0]}</p>}
        </div>
    );
};