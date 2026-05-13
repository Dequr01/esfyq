import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setIsDark(saved === 'dark')
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark, mounted])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

