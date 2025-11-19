/**
 * Generates Tailwind CSS configuration from design tokens
 */
export class TailwindGenerator {
  constructor(designTokens) {
    this.designTokens = designTokens;
  }

  generateTailwindConfig() {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};`;
  }

  generateGlobalStyles() {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-white text-gray-900 font-sans;
  }

  h1 {
    @apply text-4xl font-bold;
  }

  h2 {
    @apply text-3xl font-bold;
  }

  h3 {
    @apply text-2xl font-semibold;
  }

  h4 {
    @apply text-xl font-semibold;
  }

  h5 {
    @apply text-lg font-semibold;
  }

  h6 {
    @apply text-base font-semibold;
  }

  p {
    @apply text-base leading-relaxed;
  }

  a {
    @apply text-blue-600 hover:text-blue-700 transition-colors;
  }

  button {
    @apply transition-colors;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors;
  }

  .btn-outline {
    @apply px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors;
  }

  .card {
    @apply bg-white rounded-lg border border-gray-200 shadow-sm p-6;
  }

  .input-base {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-600;
  }

  .container-base {
    @apply mx-auto px-4 max-w-6xl;
  }
}

@layer utilities {
  .text-truncate {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
  }

  .line-clamp-2 {
    @apply line-clamp-2;
  }

  .line-clamp-3 {
    @apply line-clamp-3;
  }

  .transition-fast {
    @apply transition-all duration-200;
  }

  .transition-smooth {
    @apply transition-all duration-300;
  }
}`;
  }

  generatePostCSSConfig() {
    return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
  }
}

export default TailwindGenerator;
