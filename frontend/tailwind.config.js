const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: [
        './components/**/*.js',
        './components/**/*.tsx',
        './components/**/*.ts',
        './pages/**/*.js',
        './pages/**/*.mdx',
        './pages/**/*.tsx',
        './pages/**/*.ts',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: '#3356BC',
            },
            backgroundColor: (theme) => ({
                brand: '#3356BC',
            }),
        },
    },
    variants: {
        animation: ['responsive', 'group-hover', 'hover'],
    },
    plugins: [require('@tailwindcss/ui')],
}
