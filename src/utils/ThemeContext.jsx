import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from './helpers';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ACCENT_COLORS = [
  { id: 'indigo', name: 'Elite Indigo', primary: '#4f46e5', secondary: '#4338ca' },
  { id: 'crimson', name: 'Power Crimson', primary: '#e11d48', secondary: '#be123c' },
  { id: 'emerald', name: 'Vital Emerald', primary: '#059669', secondary: '#047857' },
  { id: 'gold', name: 'Lux Gold', primary: '#d97706', secondary: '#b45309' },
  { id: 'violet', name: 'Royal Violet', primary: '#7c3aed', secondary: '#6d28d9' }
];

export const ThemeProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState(() => {
    return getFromLocalStorage('theme-accent', ACCENT_COLORS[0]);
  });

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      null;
  };

  const updateRootStyles = useCallback((currentAccent) => {
    const root = window.document.documentElement;
    
    // Always remove dark mode
    root.classList.remove('dark');

    // Apply Accent Colors
    const primary = currentAccent.primary;
    const secondary = currentAccent.secondary;
    const rgb = hexToRgb(primary);
    
    root.style.setProperty('--primary-500', primary);
    root.style.setProperty('--primary-600', secondary);
    root.style.setProperty('--primary-rgb', rgb);
    
    // Set darker/lighter variations for better depth
    root.style.setProperty('--primary-700', secondary);
    root.style.setProperty('--primary-400', `${primary}CC`); // ~80% opacity hex
  }, [hexToRgb]);

  useEffect(() => {
    updateRootStyles(accentColor);
    saveToLocalStorage('theme-accent', accentColor);
  }, [accentColor, updateRootStyles]);

  const changeAccentColor = (colorId) => {
    const color = ACCENT_COLORS.find(c => c.id === colorId);
    if (color) {
      setAccentColor(color);
    }
  };

  const value = {
    accentColor,
    changeAccentColor,
    ACCENT_COLORS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
