/** @type {import(tailwindcss').Config */
export const content = ["./src/OMRUlancer_frontend/src/**/*.{html,js,jsx,tsx}"];
export const theme = {
    extend: {
        colors:{
            tWhite:"rgb(255,255,255,0.4)",
            tBlack:"rgb(0,0,0,0.4)",
        },
        backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          },
    },
};
export const plugins = []; 