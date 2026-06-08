"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { Search, Bell } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

interface DashboardTopbarProps {
  title: string
  roleLabel: string
}

interface SearchResultItem {
  id: string
  title: string
  url: string
  subtitle: string
}

interface SearchResultGroup {
  categoryKey: string
  items: SearchResultItem[]
}

export function DashboardTopbar({ title, roleLabel }: DashboardTopbarProps) {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const router = useRouter()

  const userEmail = session?.user?.email || ""
  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "??"

  // Search Palette State
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResultGroup[]>([])
  const [loading, setLoading] = useState(false)

  // Keyboard shortcut Ctrl+K to toggle search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Debounced query fetching
  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(search.trim())}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (err) {
        console.error("Search query error:", err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return (
    <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-4 border-b bg-background/80 backdrop-blur-sm shadow-sm transition-all duration-300">
      <SidebarTrigger />
      <h1 className="font-bold text-lg hidden sm:block text-[#0B1B3D] dark:text-[#C5A880] tracking-tight">{title}</h1>
      
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex-1 max-w-xs md:max-w-md flex items-center gap-2 px-3 py-2 bg-muted/60 border border-transparent rounded-lg hover:border-[#C5A880]/30 hover:bg-muted text-muted-foreground text-sm text-left transition-all duration-200 shadow-inner group"
      >
        <Search className="h-4 w-4 text-muted-foreground group-hover:text-[#0B1B3D] dark:group-hover:text-[#C5A880] transition-colors" />
        <span className="flex-1 truncate">{t("topbar.searchPlaceholder")}</span>
        <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      {/* Global Search Dialog Modal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={t("topbar.searchPlaceholder")}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {loading && (
            <div className="p-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span>{t("common.loading")}</span>
            </div>
          )}
          {!loading && search.trim().length >= 2 && results.length === 0 && (
            <CommandEmpty className="p-6 text-center text-sm text-muted-foreground">
              {t("topbar.noResults")} "{search}"
            </CommandEmpty>
          )}
          {!loading && results.map((group) => (
            <CommandGroup key={group.categoryKey} heading={t(group.categoryKey)}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    router.push(item.url)
                    setOpen(false)
                    setSearch("")
                  }}
                  className="cursor-pointer flex flex-col items-start gap-1 p-2 hover:bg-muted/70 transition-colors"
                >
                  <span className="font-bold text-sm text-[#0B1B3D] dark:text-[#C5A880]">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      <div className="ml-auto flex items-center gap-3">
        {/* Language switcher */}
        <LanguageToggle />

        <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-[#0B1B3D] transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border border-white animate-pulse"></span>
        </button>
        
        <Badge
          variant="outline"
          className="bg-[#C5A880]/10 border-[#C5A880]/40 text-[#0B1B3D] dark:text-[#C5A880] font-bold tracking-wider text-[10px] hidden xs:inline-flex"
        >
          {roleLabel}
        </Badge>
        
        <div className="flex items-center gap-2 pl-1 border-l">
          <Avatar className="h-8 w-8 ring-2 ring-[#C5A880] ring-offset-2 ring-offset-background hover:scale-105 transition-transform duration-200">
            <AvatarFallback className="bg-[#0B1B3D] text-[#C5A880] font-extrabold text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm hidden lg:inline font-bold text-[#0B1B3D] dark:text-gray-200 max-w-[120px] truncate">{userEmail.split("@")[0]}</span>
        </div>
      </div>
    </div>
  )
}

interface DashboardBrandProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
}

export function DashboardBrand({ icon: Icon, title, subtitle }: DashboardBrandProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-[#0B1B3D] to-[#122754] text-white -m-2 mb-0 rounded-t-md border-b border-[#C5A880]/15">
      <div className="rounded-lg bg-[#C5A880]/20 p-2 border border-[#C5A880]/30 shadow-inner animate-float">
        <Icon className="h-5 w-5 text-[#C5A880]" />
      </div>
      <div className="flex flex-col">
        <span className="font-black text-sm tracking-tight text-white">{title}</span>
        <span className="text-[9px] text-[#C5A880] font-bold uppercase tracking-wider">{subtitle}</span>
      </div>
    </div>
  )
}
