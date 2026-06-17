import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    // 1. Check if user already picked a preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // 2. Otherwise follow their OS setting
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Adds/removes the "dark" class on <html> — this is what Tailwind watches
    document.documentElement.classList.toggle('dark', dark);
    // Save preference so it persists on next visit
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Call this hook in any component to get { dark, toggle }
export const useTheme = () => useContext(ThemeContext);
