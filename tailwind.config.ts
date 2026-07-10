import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7B3F98",
          light: "#9B5FB8",
          dark: "#5B2F78",
        },
        secondary: {
          DEFAULT: "#F48FB1",
          light: "#F8BBD0",
          dark: "#E57399",
        },
        accent: "#E57399",
        background: "#FFF9F7",
        surface: "#FFFFFF",
        hermaa: {
          bg: "#FFF9F7",
          card: "#FFFFFF",
          text: "#2D1B3E",
          muted: "#6B5B7B",
          light: "#9B8BAB",
        },
        cycle: {
          menstrual: "#E57373",
          follicular: "#81C784",
          ovulation: "#FFB74D",
          luteal: "#64B5F6",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(123, 63, 152, 0.08)",
        "glass-lg": "0 16px 48px rgba(123, 63, 152, 0.12)",
        glow: "0 0 40px rgba(123, 63, 152, 0.15)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7B3F98, #F48FB1)",
        "gradient-hero": "linear-gradient(135deg, #FFF9F7, #FCE4EC, #F3E5F5)",
        "gradient-card": "linear-gradient(135deg, #FFF9F7, #F3E5F5)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
