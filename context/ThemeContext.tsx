// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Appearance } from 'react-native';

const defaultTheme = Appearance.getColorScheme() === 'dark';

const ThemeContext = createContext({
  isDarkMode: defaultTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultTheme);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
