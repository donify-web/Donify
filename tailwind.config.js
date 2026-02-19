
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0ca1b3',
                    hover: '#049db0',
                },
                secondary: '#7ab8de',
                bgMain: '#edf6f7',
                textMain: '#73797a',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-mesh': 'radial-gradient(at 0% 0%, hsla(187,100%,88%,1) 0px, transparent 50%), radial-gradient(at 100% 0%, hsla(202,100%,92%,1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(187,100%,94%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(200,100%,96%,1) 0px, transparent 50%)',
                'gradient-bronze': 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                'gradient-silver': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                'gradient-gold': 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                'gradient-diamond': 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
                'pattern-dots': 'radial-gradient(#0ca1b3 0.5px, transparent 0.5px)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        }
    },
    plugins: [],
}
