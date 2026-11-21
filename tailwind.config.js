/** @type {import('tailwindcss').Config} */
export default {
  // 1. Habilitamos el modo oscuro basado en una clase ('dark') en el HTML
  darkMode: 'class',
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // 2. Definimos la paleta de colores vinculada a variables CSS nativas
      colors: {
        brand: {
          // Color verde principal de Próspero
          primary: 'rgb(var(--color-brand) / <alpha-value>)',
          // Verde suave para fondos de tarjetas y barras
          soft: 'rgb(var(--color-brand-soft) / <alpha-value>)',
          // Color de fondo para el panel oscuro (izquierdo)
          panel: 'rgb(var(--color-bg-panel) / <alpha-value>)',
          // Color de fondo principal para el área de formularios
          bg: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          // Color de texto principal y botones de acción
          text: 'rgb(var(--color-text-main) / <alpha-value>)',
        }
      },
      // 3. Tipografía y otros ajustes estéticos
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}