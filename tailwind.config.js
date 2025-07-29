module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                slide: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                slide: 'slide 3s linear infinite',
            },
        },
    },
    plugins: [],
};
// tailwind.config.js
module.exports = {
    content: [
        /* other paths */
        ,
        'node_modules/flowbite-react/lib/esm/**/*.js',
    ],
    plugins: [require('flowbite/plugin')],
};