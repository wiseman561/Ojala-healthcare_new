/** @type {import(\'tailwindcss\').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Map MUI palette to Tailwind
        primary: {
          DEFAULT: \'#1976d2\', // main
          light: \'#42a5f5\',
          dark: \'#1565c0\',
        },
        secondary: {
          DEFAULT: \'#9c27b0\', // main
          light: \'#ba68c8\',
          dark: \'#7b1fa2\',
        },
        error: \'#d32f2f\',
        warning: \'#ed6c02\',
        info: \'#0288d1\',
        success: \'#2e7d32\',
        background: \'#f5f5f5\', // background.default
        paper: \'#ffffff\', // background.paper
        text: {
          DEFAULT: \'rgba(0, 0, 0, 0.87)\', // text.primary
          secondary: \'rgba(0, 0, 0, 0.6)\',
          disabled: \'rgba(0, 0, 0, 0.38)\',
        },
        // Keep shadcn/ui specific colors if needed, but remove sidebar for now
        border: \'hsl(var(--border))\', // Example from shadcn
        input: \'hsl(var(--input))\', // Example from shadcn
        ring: \'hsl(var(--ring))\', // Example from shadcn
        foreground: \'hsl(var(--foreground))\', // Example from shadcn
        destructive: {
          DEFAULT: \'hsl(var(--destructive))\',
          foreground: \'hsl(var(--destructive-foreground))\',
        },
        muted: {
          DEFAULT: \'hsl(var(--muted))\',
          foreground: \'hsl(var(--muted-foreground))\',
        },
        accent: {
          DEFAULT: \'hsl(var(--accent))\',
          foreground: \'hsl(var(--accent-foreground))\',
        },
        popover: {
          DEFAULT: \'hsl(var(--popover))\',
          foreground: \'hsl(var(--popover-foreground))\',
        },
        card: {
          DEFAULT: \'hsl(var(--card))\', // Typically maps to paper color
          foreground: \'hsl(var(--card-foreground))\', // Typically maps to text color
        },
      },
      borderRadius: {
        DEFAULT: \'8px\', // Standard MUI radius
        sm: \'4px\', // Smaller radius
        md: \'8px\', // Explicitly match default
        lg: \'12px\', // MUI Card radius
        // Keep shadcn/ui radius variables if needed, but override with explicit values
        // lg: \'var(--radius)\', 
        // md: \'calc(var(--radius) - 2px)\',
        // sm: \'calc(var(--radius) - 4px)\'
      },
      fontFamily: {
        sans: [\'Roboto\', \'"Helvetica Neue"\', \'Arial\', \'sans-serif\'],
      },
      // Keep keyframes and animation for shadcn/ui components
      keyframes: {
        \'accordion-down\': {
          from: { height: \'0\' },
          to: { height: \'var(--radix-accordion-content-height)\' },
        },
        \'accordion-up\': {
          from: { height: \'var(--radix-accordion-content-height)\' },
          to: { height: \'0\' },
        },
      },
      animation: {
        \'accordion-down\': \'accordion-down 0.2s ease-out\',
        \'accordion-up\': \'accordion-up 0.2s ease-out\',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

