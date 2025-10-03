import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement?.classList?.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`p-2 theme-transition ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Icon 
        name={theme === 'light' ? 'Moon' : 'Sun'} 
        size={20}
        className="transition-all duration-300 hover:scale-110"
      />
    </Button>
  );
};

export default ThemeToggle;