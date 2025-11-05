// Use the object form so PostCSS/Next can require the plugins properly.
// Use the adapter package via the "tailwindcss" key (PostCSS will resolve
// the installed adapter package automatically).
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
