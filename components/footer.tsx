"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { language, t } = useLanguage()

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/news", label: t("nav.news") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/church-logo.png" alt="Church Logo" width={48} height={48} className="rounded-full" />
              <div>
                <h3 className={`font-bold text-xl font-space-grotesk ${language === "am" ? "font-ethiopic" : ""}`}>
                  {language === "en" ? "Fnote Selam Sunday School" : "ፍኖተ ሰላም ሰንበት ት/ቤት"}
                </h3>
                <p className={`text-sm text-primary-foreground/80 ${language === "am" ? "font-ethiopic" : ""}`}>
                  {language === "en" ? "Growing in faith, wisdom, and service" : "የእምነት እውቀት እና አገልግሎት ማሻሻያ"}
                </p>
              </div>
            </div>
            <p className={`text-primary-foreground/80 mb-6 max-w-md ${language === "am" ? "font-ethiopic" : ""}`}>
              {language === "en"
                ? "Join our community of faith as we grow together in wisdom, love, and service to God and our neighbors."
                : "በጥበብ፣ በፍቅር እና ለእግዚአብሔር እና ለጎረቤቶቻችን በአገልግሎት አብረን ስናድግ የእምነት ማህበረሰባችንን ይቀላቀሉ።"}
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold text-lg mb-4 ${language === "am" ? "font-ethiopic" : ""}`}>
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-primary-foreground/80 hover:text-accent transition-colors ${language === "am" ? "font-ethiopic" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className={`font-semibold text-lg mb-4 ${language === "am" ? "font-ethiopic" : ""}`}>
              {t("footer.contact")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span className={`text-sm text-primary-foreground/80 ${language === "am" ? "font-ethiopic" : ""}`}>
                  {t("footer.address")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" />
                <a
                  href="tel:+251944247165"
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {t("nav.phone")}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" />
                <a
                  href="mailto:info@fnotesalam.org"
                  className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  {t("footer.email")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="max-w-md">
            <h4 className={`font-semibold text-lg mb-2 ${language === "am" ? "font-ethiopic" : ""}`}>
              {t("footer.newsletter")}
            </h4>
            <p className={`text-primary-foreground/80 text-sm mb-4 ${language === "am" ? "font-ethiopic" : ""}`}>
              {t("footer.newsletterDesc")}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={language === "en" ? "Enter your email" : "ኢሜልዎን ያስገቡ"}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">{t("footer.subscribe")}</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
          <p className={`text-sm text-primary-foreground/60 ${language === "am" ? "font-ethiopic" : ""}`}>
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
