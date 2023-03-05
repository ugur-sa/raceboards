/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      formula: ['Formula1-Regular', 'sans-serif'],
    },
    extend: {
      zIndex: {
        0: '0 !important',
      },
    },
  },
  plugins: [require('daisyui')],
  variants: {
    zIndex: ['responsive'],
  },
};
