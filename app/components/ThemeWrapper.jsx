// app/components/ThemeWrapper.jsx
'use client';
import { useTheme } from '../context/themeContext';

export default function ThemeWrapper({ children }) {
  const { darkMode } = useTheme();

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <body className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f3eaea]'}`}>
        {children}
      </body>
    </html>
  );
}