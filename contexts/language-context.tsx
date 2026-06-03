"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "am"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.news": "News",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact Us",
    "nav.login": "Login",
    "nav.joinSundaySchool": "Join Sunday School",
    "nav.phone": "+251 94 424 7165",

    // Common
    "common.learnMore": "Learn More",
    "common.joinUs": "Join Us",
    "common.contact": "Contact",
    "common.readMore": "Read More",
    "common.viewAll": "View All",
    "common.submit": "Submit",
    "common.loading": "Loading...",

    // Homepage
    "home.hero.title": "Sunday School",
    "home.hero.subtitle": "Growing in faith, wisdom, and service",
    "home.stats.students": "Students Taught",
    "home.stats.years": "Years of Service",
    "home.stats.attendance": "Weekly Attendance",
    "home.stats.teachers": "Volunteer Teachers",

    // Footer
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact Information",
    "footer.newsletter": "Newsletter",
    "footer.newsletterDesc": "Stay updated with our latest news and events",
    "footer.subscribe": "Subscribe",
    "footer.copyright": "© 2024 Fnote Selam Sunday School. All rights reserved.",
    "footer.address": "Buraayu, Ethiopia",
    "footer.email": "info@fnotesalam.org",
  },
  am: {
    // Navigation
    "nav.home": "መነሻ",
    "nav.about": "ስለ እኛ",
    "nav.news": "ዜና",
    "nav.gallery": "ምስሎች",
    "nav.contact": "ያግኙን",
    "nav.login": "ግባ",
    "nav.joinSundaySchool": "ይቀላቀሉ",
    "nav.phone": "+251 94 424 7165",

    // Common
    "common.learnMore": "ተጨማሪ ይወቁ",
    "common.joinUs": "ተቀላቀሉ",
    "common.contact": "ተገናኝ",
    "common.readMore": "ተጨማሪ ያንብቡ",
    "common.viewAll": "ሁሉንም ይመልከቱ",
    "common.submit": "ላክ",
    "common.loading": "እየጫነ...",

    // Homepage
    "home.hero.title": "ሰንበት ት/ቤት",
    "home.hero.subtitle": "የእምነት እውቀት እና አገልግሎት ማሻሻያ",
    "home.stats.students": "የተማሩ ተማሪዎች",
    "home.stats.years": "የአገልግሎት ዓመታት",
    "home.stats.attendance": "ሳምንታዊ ተሳትፎ",
    "home.stats.teachers": "በጎ ፈቃደኛ መምህራን",

    // Footer
    "footer.quickLinks": "ፈጣን አገናኞች",
    "footer.contact": "የመገናኛ መረጃ",
    "footer.newsletter": "ዜና ወረቀት",
    "footer.newsletterDesc": "የእኛን የቅርብ ጊዜ ዜናዎች እና ክስተቶች ይከታተሉ",
    "footer.subscribe": "ይመዝገቡ",
    "footer.copyright": "© 2024 ፍኖተ ሰላም ሰንበት ት/ቤት። ሁሉም መብቶች የተጠበቁ ናቸው።",
    "footer.address": "ቡራዩ፣ ኢትዮጵያ",
    "footer.email": "info@fnotesalam.org",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "am")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    // Update document language attribute
    document.documentElement.lang = lang === "am" ? "am" : "en"
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
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
