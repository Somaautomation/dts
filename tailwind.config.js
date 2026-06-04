/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        // Congress-inspired brand palette
        brand: {
          blue: '#003366',
          'blue-dark': '#00264d',
          'blue-light': '#1a4d80',
          green: '#138808',
          'green-dark': '#0f6b06',
          saffron: '#FF9933',
          'saffron-dark': '#e6831a',
          cream: '#FFF8E7',
          gray: '#F5F5F5',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#003366',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#138808',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#FF9933',
          foreground: '#003366',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        kannada: ['var(--font-noto-kannada)', 'serif'],
        display: ['var(--font-poppins)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.6s ease-out',
        marquee: 'marquee linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
