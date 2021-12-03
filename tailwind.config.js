module.exports = {
  purge: [
    "./src/components/**/*.js",
    "./src/pages/**/*.js",
    "./src/views/**/*.js",
  ],
  theme: {
    extend: {},
    container: {
      screens: {
        "sm": "100%",
        "md": "100%",
        "lg": "1024px",
        "xl": "1024px",
        "2xl": "1024px",
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
