// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: ["class"],
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//     },
//   },
//   plugins: [
//     plugin(function({ addUtilities }) {
//       addUtilities({
//         '.bg-background': { backgroundColor: 'hsl(var(--background))' },
//         '.text-foreground': { color: 'hsl(var(--foreground))' },
//       });
//     }),
//   ],
// }
/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.bg-background': { backgroundColor: 'hsl(var(--background))' },
        '.text-foreground': { color: 'hsl(var(--foreground))' },
        '.bg-card': { backgroundColor: 'hsl(var(--card))' },
        '.text-card-foreground': { color: 'hsl(var(--card-foreground))' },
        '.bg-popover': { backgroundColor: 'hsl(var(--popover))' },
        '.text-popover-foreground': { color: 'hsl(var(--popover-foreground))' },
        '.bg-primary': { backgroundColor: 'hsl(var(--primary))' },
        '.text-primary-foreground': { color: 'hsl(var(--primary-foreground))' },
        '.bg-secondary': { backgroundColor: 'hsl(var(--secondary))' },
        '.text-secondary-foreground': { color: 'hsl(var(--secondary-foreground))' },
        '.bg-destructive': { backgroundColor: 'hsl(var(--destructive))' },
        '.text-destructive-foreground': { color: 'hsl(var(--destructive-foreground))' },
        '.bg-muted': { backgroundColor: 'hsl(var(--muted))' },
        '.text-muted-foreground': { color: 'hsl(var(--muted-foreground))' },
        '.bg-accent': { backgroundColor: 'hsl(var(--accent))' },
        '.text-accent-foreground': { color: 'hsl(var(--accent-foreground))' },
      });
    }),
  ],
};
