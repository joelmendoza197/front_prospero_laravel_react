import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

export const SidebarHeader = ({ isCollapsed }) => {
    const [householdName, setHouseholdName] = useState('Mi Hogar');

    useEffect(() => {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setHouseholdName(user.household_name
                    ? `Familia ${user.household_name}`
                    : `Hogar de: ${user.name}`
                );
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        }
    }, []);

    return (
        <div className={`flex items-center gap-3 px-2 mb-6 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'flex-row'}`}>
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg shrink-0">
                <TrendingUp size={24} />
            </div>

            {!isCollapsed && (
                <div className="overflow-hidden animate-in fade-in duration-500">
                    <h2 className="font-bold text-brand-text text-lg leading-tight truncate">Prospero</h2>
                    <p className="text-[10px] text-gray-500 truncate font-medium uppercase tracking-wider">
                        {householdName}
                    </p>
                </div>
            )}
        </div>
    );
};