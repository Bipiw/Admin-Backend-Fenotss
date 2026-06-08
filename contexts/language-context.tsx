"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getTranslation } from "@/lib/translations"

type Language = "en" | "am"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // 1. Get from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "am")) {
      setLanguageState(savedLanguage)
      // Standardize cookie if not set
      if (!document.cookie.includes("language=")) {
        document.cookie = `language=${savedLanguage}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
      }
    } else {
      // Set default cookie
      document.cookie = `language=en; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    // 2. Set the cookie for Server Components to read
    document.cookie = `language=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    document.documentElement.lang = lang === "am" ? "am" : "en"
    
    // 3. Reload window to ensure Server Components re-fetch and render in the new language
    window.location.reload()
  }

  const t = (key: string): string => {
    return getTranslation(language, key)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
