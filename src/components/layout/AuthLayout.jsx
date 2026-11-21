// src/components/layout/AuthLayout.jsx
import { Home, Users, Wallet } from 'lucide-react';
import { PreviewCard } from '../ui/PreviewCard';
import { ThemeToggle } from '../ui/ThemeTooggle';

export const AuthLayout = ({ children, title, subtitle, isRegister = false }) => (
    /* 1. bg-brand-panel en el padre para que no se vea blanco al scrollear */
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-panel font-sans">
        
        {/* Lado Izquierdo */}
        <div className="hidden md:flex md:w-[55%] bg-brand-panel p-16 flex-col text-white md:sticky md:top-0 md:h-screen">
            <div className="flex items-center gap-2 mb-8">
                <div className="bg-white p-1.5 rounded-lg">
                    <Home className="text-brand-panel w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight uppercase">Próspero</span>
            </div>

            {/* 2. Contenedor con scale-75 para que la tarjeta no se rompa en pantallas pequeñas */}
            <div className="flex-grow flex items-center justify-center mb-16 overflow-hidden">
                <div className="w-full max-w-md transform scale-75 lg:scale-100 transition-all duration-700 origin-center">
                    <PreviewCard />
                </div>
            </div>

            <div className="mt-auto">
                <h1 className="text-5xl font-bold leading-tight mb-8">
                    {isRegister ? "Únete a miles de familias que ya controlan sus finanzas." : "Toma el control de las finanzas de tu hogar."}
                </h1>
                <div className="flex gap-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-3 rounded-full"><Users size={20} /></div>
                        <div><p className="text-2xl font-bold">50,000+</p><p className="text-gray-500 text-xs">Familias activas</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-3 rounded-full"><Wallet size={20} /></div>
                        <div><p className="text-2xl font-bold">$2.5M</p><p className="text-gray-500 text-xs">Ahorrados este mes</p></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Lado Derecho: Aquí se mantiene el fondo crema */}
        <div className="w-full md:w-[45%] flex items-center justify-center p-8 lg:p-16 bg-brand-bg">
            
            {/* --- AQUÍ INSERTAMOS EL BOTÓN --- */}
            <div className="absolute top-8 right-8">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full">
                <h2 className="text-4xl font-bold text-brand-text mb-2">{title}</h2>
                <p className="text-gray-500 mb-8">{subtitle}</p>
                {children}
            </div>
        </div>
    </div>
);