import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gov: {
          blue: "#1F5E91",
          dark: "#123B5D",
          orange: "#F39A32",
          bg: "#F5F4F0",
          gray: "#E9E9E9",
          text: "#1F2933",
          muted: "#667085",
        },
        civic: {
          navy: "hsl(222, 47%, 18%)",
          indigo: "hsl(224, 76%, 48%)",
          slate: "hsl(215, 25%, 27%)",
          light: "hsl(210, 40%, 98%)",
        },
        priority: {
          p0: "hsl(0, 84%, 60%)",
          p1: "hsl(24, 95%, 53%)",
          p2: "hsl(45, 93%, 47%)",
          p3: "hsl(199, 89%, 48%)",
        },
        sla: {
          within: "hsl(142, 71%, 45%)",
          risk: "hsl(38, 92%, 50%)",
          breached: "hsl(350, 89%, 60%)",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
