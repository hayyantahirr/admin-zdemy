"use client";

import React, { createContext, useState, useContext } from "react";

// Create a context for theme management
const ThemeContext = createContext();

// Create a provider component to wrap the application and provide theme state
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme (light or dark)
  const [theme, setTheme] = useState("dark");

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Provide the theme and toggle function to children components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context in components
export const useTheme = () => useContext(ThemeContext);
