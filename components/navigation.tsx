"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "./language-toggle"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, t } = useLanguage()

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/news", label: t("nav.news") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/login", label: t("nav.login") },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+251944247165" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" />
              {t("nav.phone")}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/church-logo.png" alt="Church Logo" width={40} height={40} className="rounded-full" />
              <div className="hidden sm:block">
                <h1
                  className={`font-bold text-lg text-white font-space-grotesk ${language === "am" ? "font-ethiopic" : ""}`}
                >
                  {language === "en" ? "Fnote Selam Sunday School" : "ፍኖተ ሰላም ሰንበት ት/ቤት"}
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium text-white hover:text-secondary transition-colors ${language === "am" ? "font-ethiopic" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
              <Button className="bg-secondary hover:bg-secondary/90 text-primary">{t("nav.joinSundaySchool")}</Button>
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:text-secondary">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg font-medium text-foreground hover:text-accent transition-colors ${language === "am" ? "font-ethiopic" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                    {t("nav.joinSundaySchool")}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
