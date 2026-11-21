import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const IdleTimer = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            // 1 hora de actividad
            timer = setTimeout(() => {
                localStorage.removeItem('token');
                alert("Sesión cerrada por inactividad.");
                navigate('/login');
            }, 3600000); 
        };

        const events = ['mousedown', 'keydown', 'scroll'];
        events.forEach(e => document.addEventListener(e, resetTimer));
        resetTimer();

        return () => events.forEach(e => document.removeEventListener(e, resetTimer));
    }, [navigate]);

    return null;
};