/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B0F19',
          card: 'rgba(17, 24, 39, 0.7)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#F3F4F6',
          muted: '#9CA3AF',
          role: '#3B82F6',       // Blue
          context: '#10B981',    // Green
          data: '#F59E0B',       // Amber/Yellow
          analysis: '#8B5CF6',   // Purple
          output: '#EC4899',     // Pink
          visual: '#06B6D4',     // Cyan
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
