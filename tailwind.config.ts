import { Config } from "tailwindcss";
import daisyui, { Config as DaisyUIConfig } from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fadein-up": "fadein-up 0.2s ease-out forwards",
        fadein: "fadein 0.2s ease-out forwards",
      },
      zIndex: {},
      keyframes: {
        "fadein-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(7px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadein: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "winter", "lemonade", "nord", "cupcake"],
  },
} as Config & {
  daisyui?: DaisyUIConfig;
};
