/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    sand: '#FDFBF7',
                    coral: '#E8A6A0',
                    coralhover: '#D68C86',
                    teal: '#4A7C85',
                    dark: '#2D3748',
                    gold: '#F6E05E',
                    whatsapp: '#25D366'
                }
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        }
    },
    plugins: [],
};

