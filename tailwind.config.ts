import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#9333EA",
          magenta: "#C026D3",
          orange: "#EA580C",
          gold: "#D97706",
        },
        surface: {
          DEFAULT: "#F7F7F7",
          2: "#F0F0F0",
        },
        border: {
          DEFAULT: "#E4E4E4",
          dark: "#2A2A2A",
        },
        text: {
          primary: "#0A0A0A",
          secondary: "#5C5C5C",
          muted: "#9C9C9C",
        },
        success: "#16A34A",
        danger: "#DC2626",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #9333EA 0%, #C026D3 30%, #EA580C 70%, #D97706 100%)",
        "brand-gradient-subtle":
          "linear-gradient(135deg, #9333EA22 0%, #D9770622 100%)",
        "brand-gradient-r":
          "linear-gradient(to right, #9333EA, #D97706)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10)",
        brand: "0 0 0 2px #9333EA40",
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
