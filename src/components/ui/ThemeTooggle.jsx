import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  // Inicializamos el estado basándonos en la preferencia del sistema o lo guardado
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Opcional: para recordar la elección
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl bg-brand-soft text-brand-primary hover:opacity-80 transition-all flex items-center gap-2 border border-brand-primary/20"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <>
          <Sun size={18} />
          <span className="text-xs font-bold uppercase">Claro</span>
        </>
      ) : (
        <>
          <Moon size={18} />
          <span className="text-xs font-bold uppercase">Oscuro</span>
        </>
      )}
    </button>
  );
};