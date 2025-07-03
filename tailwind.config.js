/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#19ecc9',
        secondary: '#d5b89d',
        'dark-bg': '#0a0f19',
        'accent-red': '#ae3a35',
        'accent-blue': '#466173',
        'accent-blue2': '#193dd2',
        'accent-brown': '#674330',
        'accent-green': '#183a33',
        'text-light': '#ffffff',
        'text-dark': '#333333',
        'card-bg-light': '#ffffff',
        'card-bg-dark': '#1a1f2e',
        
        // CSS custom properties for theme switching
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'card': 'var(--card-bg)',
        'border': 'var(--border-color)',
      },
      textShadow: {
        'default': '2px 2px 4px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};