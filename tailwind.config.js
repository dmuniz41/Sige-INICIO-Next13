/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      segoe: ["Segoe UI"],
    },
    colors: {
      primary: {
        100: "#ffe0cc",
        200: "#ffc299",
        300: "#ffa366",
        400: "#ff8533",
        500: "#ff6600",
        600: "#cc5200",
        700: "#993d00",
        800: "#662900",
        900: "#331400",
      },
      white: "#FFFFFF",
      secondary: "#34395e",
      success: "#34b042",
      info: "#3abaf4",
      warning: "#ffa426",
      danger: "#fc544b",
      light: "#e3eaef",
      dark: "#191d21",
      background_light: "#f4f6f9",
      icon_color: " rgba(0, 0, 0, 0.54)",
      icon_disabled: "rgb(221, 216, 216)",
      box_shadow: "rgb(226, 223, 223)",
      border_input: "rgb(129, 127, 127)",
    },
  },
  plugins: [],
};
