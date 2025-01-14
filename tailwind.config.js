/** @type {import("tailwindcss").Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    fontFamily: {
      segoe: ["Segoe UI"]
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
        900: "#331400"
      },
      blue: {
        100: "#d0e4ff",
        200: "#a2c9ff",
        300: "#73adff",
        400: "#4592ff",
        500: "#1677ff",
        600: "#125fcc",
        700: "#0d4799",
        800: "#093066",
        900: "#041833"
      },
      white: {
        100: "#ffffff",
        200: "#ffffff",
        300: "#ffffff",
        400: "#ffffff",
        500: "#ffffff",
        600: "#cccccc",
        700: "#999999",
        800: "#666666",
        900: "#333333"
      },
      secondary: {
        100: "#d6d7df",
        200: "#aeb0bf",
        300: "#85889e",
        400: "#5d617e",
        500: "#34395e",
        600: "#2a2e4b",
        700: "#1f2238",
        800: "#151726",
        900: "#0a0b13"
      },
      success: {
        100: "#d6efd9",
        200: "#aedfb3",
        300: "#85d08e",
        400: "#5dc068",
        500: "#34b042",
        600: "#2a8d35",
        700: "#1f6a28",
        800: "#15461a",
        900: "#0a230d"
      },
      info: "#3abaf4",
      warning: "#ffa426",
      danger: {
        100: "#ffcccc",
        200: "#ff9999",
        300: "#ff6666",
        400: "#ff3333",
        500: "#ff0000",
        600: "#cc0000",
        700: "#990000",
        800: "#660000",
        900: "#330000"
      },
      purple: {
        100: "#e0d4ff",
        200: "#c0a9ff",
        300: "#a685ff",
        400: "#8a5dff",
        500: "#6c2383",
        600: "#4a1a7f",
        700: "#331466",
        800: "#1d0d4c",
        900: "#0a0526"
      },
      light: "#e3eaef",
      dark: "#191d21",
      border_light: "#f0f0f0",
      background_light: "#f4f6f9",
      icon_color: " rgba(0, 0, 0, 0.54)",
      icon_disabled: "rgb(221, 216, 216)",
      box_shadow: "rgb(226, 223, 223)",
      border_input: "rgb(129, 127, 127)"
    }
  },
  plugins: [require("tailwindcss-animated")],
  variants: {
    extend: {
      opacity: ["disabled"]
    }
  }
};
