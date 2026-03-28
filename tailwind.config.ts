import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "sans-serif"],
      },
      colors: {
        ink: "#1f2937",
        mist: "#f8fafc",
      },
      boxShadow: {
        calm: "0 12px 32px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
