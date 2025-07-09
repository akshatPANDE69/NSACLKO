/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,html}",
    "./pages/**/*.{js,ts,jsx,tsx,html}",
    "./components/**/*.{js,ts,jsx,tsx,html}",
    "./src/**/*.{js,ts,jsx,tsx,html}", // Add this if you use src folder
    "./*.{js,ts,jsx,tsx,html}", // Add this for root level files
  ],
  theme: {
    extend: {
      // Add custom spacing values you're using
      spacing: {
        15: "3.75rem", // for gap-[15px]
        18: "4.5rem", // for py-[18px]
        30: "7.5rem", // for px-[30px], py-[30px], etc.
        35: "8.75rem", // for px-[35px]
        50: "12.5rem", // for gap-[50px], etc.
        60: "15rem", // for px-[60px]
        80: "20rem", // for py-[80px]
      },

      // Add custom font sizes
      fontSize: {
        12: ["12px", { lineHeight: "1.5" }],
        14: ["14px", { lineHeight: "1.5" }],
        16: ["16px", { lineHeight: "1.6" }],
        18: ["18px", { lineHeight: "1.6" }],
        20: ["20px", { lineHeight: "1.6" }],
        28: ["28px", { lineHeight: "1.2" }],
        32: ["32px", { lineHeight: "1.2" }],
        "3.5rem": ["3.5rem", { lineHeight: "1.1" }],
        "5.5rem": ["5.5rem", { lineHeight: "1.1" }],
      },

      // Add custom letter spacing
      letterSpacing: {
        "1px": "1px",
        "2px": "2px",
        "3px": "3px",
        "4px": "4px",
        "8px": "8px",
      },

      // Add custom z-index values
      zIndex: {
        1000: "1000",
        9999: "9999",
      },

      // Add custom backdrop blur
      backdropBlur: {
        lg: "16px",
        md: "12px",
      },

      // Add custom colors for your specific needs
      colors: {
        black: "#000000",
        white: "#ffffff",
        "gray-400": "#9ca3af",
        "gray-666": "#666666",
      },

      // Add custom animations
      animation: {
        fadeInScale: "fadeInScale 1.5s ease-out 0.5s forwards",
        fadeInUp: "fadeInUp 1s ease-out forwards",
        heroContentFadeIn: "heroContentFadeIn 2s ease-out 0.5s forwards",
        slideInFromTop: "slideInFromTop 1s ease-out 0.8s forwards",
        titleReveal: "titleReveal 1.2s ease-out 1s forwards",
        slideInFromBottom: "slideInFromBottom 1s ease-out 1.2s forwards",
        buttonsAppear: "buttonsAppear 1s ease-out 1.5s forwards",
        scrollIndicatorAppear: "scrollIndicatorAppear 1s ease-out 2s forwards",
        scrollDotSmooth: "scrollDotSmooth 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },

      // Add custom keyframes
      keyframes: {
        fadeInScale: {
          "0%": {
            opacity: "0",
            transform: "scale(0.8) translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(50px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        heroContentFadeIn: {
          to: {
            opacity: "1",
          },
        },
        slideInFromTop: {
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        titleReveal: {
          "0%": {
            opacity: "0",
            transform: "scale(0.8) translateY(20px)",
            filter: "blur(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
            filter: "blur(0)",
          },
        },
        slideInFromBottom: {
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        buttonsAppear: {
          to: {
            opacity: "1",
          },
        },
        scrollIndicatorAppear: {
          from: {
            opacity: "0",
            transform: "translateX(-50%) translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(-50%) translateY(0)",
          },
        },
        scrollDotSmooth: {
          "0%": {
            top: "8px",
            opacity: "0",
          },
          "15%": {
            opacity: "1",
          },
          "85%": {
            opacity: "1",
          },
          "100%": {
            top: "36px",
            opacity: "0",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)",
            opacity: "0.6",
          },
          "50%": {
            transform: "translateY(-20px) translateX(10px)",
            opacity: "1",
          },
        },
      },

      // Add custom transition durations
      transitionDuration: {
        300: "300ms",
        400: "400ms",
        500: "500ms",
      },

      // Add custom box shadows
      boxShadow: {
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "text-lg": "2px 2px 20px rgba(0, 0, 0, 0.5)",
      },

      // Add custom max widths
      maxWidth: {
        "screen-xl": "1280px",
        "1400px": "1400px",
        "800px": "800px",
        "500px": "500px",
      },

      // Add custom brightness and contrast
      brightness: {
        ".7": ".7",
      },
      contrast: {
        1.1: "1.1",
      },
    },
  },
  plugins: [
    // Add a plugin for text shadow since Tailwind doesn't include it by default
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-lg": {
          textShadow: "2px 2px 20px rgba(0, 0, 0, 0.5)",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
