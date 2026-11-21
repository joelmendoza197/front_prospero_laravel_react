import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, ChevronUp } from 'lucide-react';

export const UserMenu = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    
    // Estado inicial con valores por defecto para evitar errores visuales
    const [userData, setUserData] = useState({
        name: 'Usuario',
        email: 'cargando...',
        initials: '??'
    });

    useEffect(() => {
        // Recuperamos los datos que Laravel guardó al iniciar sesión
        const storedUser = localStorage.getItem('user_data');
        
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                // Generamos las iniciales dinámicamente
                const initials = user.name
                    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                    : 'U';

                setUserData({
                    name: user.name,
                    email: user.email,
                    initials: initials
                });
            } catch (error) {
                console.error("Error al leer datos del usuario:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        setIsOpen(false); // Cerramos el popover primero
    
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_data');
            window.location.href = '/';
        }, 100);
    };

    return (
        <div className="relative w-full">
            {/* Popover de Opciones */}
            {isOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-brand-bg rounded-2xl shadow-xl border border-brand-soft overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2">
                    <button 
                        className="w-full flex items-center gap-3 p-4 text-brand-text hover:bg-brand-soft transition-colors border-b border-brand-soft"
                        onClick={() => navigate('/settings')}
                    >
                        <Settings size={18} className="text-gray-400" />
                        <span className="font-medium text-sm">Configuracion</span>
                    </button>
                    <button 
                        className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Cerrar sesion</span>
                    </button>
                </div>
            )}

            {/* Botón de Perfil Principal */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${
                    isOpen ? 'bg-brand-soft' : 'hover:bg-white/5'
                }`}
            >
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    {userData.initials}
                </div>
                
                <div className="flex-1 text-left overflow-hidden">
                    <p className={`font-bold text-sm truncate ${isOpen ? 'text-brand-text' : 'text-white'}`}>
                        {userData.name}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                        {userData.email}
                    </p>
                </div>
                
                <ChevronUp 
                    size={16} 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-text' : 'text-gray-500'}`} 
                />
            </button>
        </div>
    );
};