"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="h-8 px-2 text-xs"
      >
        EN
      </Button>
      <Button
        variant={language === "am" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("am")}
        className="h-8 px-2 text-xs font-ethiopic"
      >
        አማ
      </Button>
    </div>
  )
}
