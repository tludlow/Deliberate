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
                'brand-light': '#3d64d4',
            },
            backgroundColor: (theme) => ({
                brand: '#3356BC',
            }),
            height: {
                within: 'calc(100vh - 52px)',
            },
            maxHeight: {
                within: 'calc(100vh - 52px)',
            },
            inset: {
                '-3': '-0.75rem',
            },
            boxShadow: {
                xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
                outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
              },
        },
    },
    variants: {
        animation: ['responsive', 'group-hover', 'hover'],
        backgroundColor: ['responsive', 'hover', 'focus', 'checked'],
        textColor: ["responsive", "hover", "focus", "group-hover"],
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/ui')],
}
