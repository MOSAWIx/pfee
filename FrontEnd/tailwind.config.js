/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode using a class (e.g., 'dark')
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true, // Centers the container
      padding: {
        DEFAULT: "1rem", // Default padding on all screens
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
      },
    },
    extend: {
      screens: {
        sm: "640px",  // Small devices (phones)
        md: "768px",  // Tablets
        lg: "1024px", // Laptops
        xl: "1280px", // Desktops
        "2xl": "1440px", // Large screens
        "3xl": "1600px", // 4K screens
      },
      keyframes: {
        'fill-ring': {
          '0%': { background: 'conic-gradient(white 0deg, transparent 0deg)' },
          '100%': { background: 'conic-gradient(white 360deg, transparent 0deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fill-ring': 'fill-ring 0.5s linear forwards',
        'shimmer': 'shimmer 1.5s infinite linear',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      spacing: {
        'section-padding': 'var(--section-padding)', // Default value is 2rem
      },
    },
  },
  plugins: [],
}
