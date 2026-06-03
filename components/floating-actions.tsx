"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Heart, ChevronUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
          aria-label={language === "en" ? "Scroll to top" : "ወደ ላይ ይሂዱ"}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      {/* Donate Button */}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={language === "en" ? "Donate" : "ይለግሱ"}
      >
        <Heart className="h-5 w-5" />
      </Button>

      {/* WhatsApp Button */}
      <Button
        asChild
        size="icon"
        className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label={language === "en" ? "Chat on WhatsApp" : "በWhatsApp ይወያዩ"}
      >
        <a href="https://wa.me/251944247165" target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-5 w-5" />
        </a>
      </Button>

      {/* Phone Call Button */}
      <Button
        asChild
        size="icon"
        className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
        aria-label={language === "en" ? "Call us" : "ይደውሉልን"}
      >
        <a href="tel:+251944247165">
          <Phone className="h-5 w-5" />
        </a>
      </Button>
    </div>
  )
}
