module.exports = {   //tailwind configuration
    content: [
      "./src/**/*.{html,ts}" // Ensures Tailwind scans all Angular templates and components
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };
  