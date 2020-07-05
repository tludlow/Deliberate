const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: ['./components/**/*.js', './pages/**/*.js', './pages/**/*.mdx', './jobs/**/*.md'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: '#3356BC',
            },
        },
        inset: {
            '-3': '-0.75rem',
        },
    },
    variants: {},
    plugins: [require('@tailwindcss/ui')],
}
