/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                text: '#DDEEEE',
                bg: {
                    800: '#030926 ',
                    900: '#000212',
                },
                semi: {
                    bg: 'rgba(254, 254, 254, 0.08)',
                    border: 'rgba(254, 254, 254, 0.15)',
                    promoted: 'rgba(229, 157, 255, 0.1)',
                },
            },
            fontFamily: {
                sans: ['var(--font-nunito)'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            borderWidth: {
                0.5: '0.5px',
            },
        },
    },
    plugins: [],
}
