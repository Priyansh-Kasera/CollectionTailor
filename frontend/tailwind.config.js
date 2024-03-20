/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        slate: "#C4A478",
        slate500: "#C4A478AA",
        background: "#fdf9f0",
      },
      borderColor: {
        background: "#fdf9f0",
      },
      width: {
        "1/10": "10%",
        "1/20": "7%",
      },
    },
  },
  plugins: [],
};
