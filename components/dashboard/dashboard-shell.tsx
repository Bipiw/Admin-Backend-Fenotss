"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Bell, Search, LogOut, Key, ChevronDown, Moon, Sun } from "lucide-react"
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

export interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string; size?: number | string }>
}

interface DashboardShellProps {
  children: React.ReactNode
  navItems: NavItem[]
  secondaryNavItems?: { label: string; items: NavItem[] }
  brandTitle: string
  brandSubtitle: string
  brandIcon: React.ComponentType<{ className?: string; size?: number | string }>
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

export function DashboardShell({
  children,
  navItems,
  secondaryNavItems,
  brandTitle,
  brandSubtitle,
  brandIcon: BrandIcon,
  roleLabel,
}: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { t } = useLanguage()

  const userEmail = session?.user?.email || ""
  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "??"
  const userName = userEmail.split("@")[0] || roleLabel

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResultGroup[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Persist dark mode
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      setDarkMode(true)
      document.documentElement.setAttribute("data-theme", "dark")
    } else {
      document.documentElement.setAttribute("data-theme", "light")
    }
  }, [])

  const toggleTheme = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSearchOpen(o => !o) }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSearchResults([]); return }
    const delay = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
        if (res.ok) setSearchResults(await res.json())
      } catch { /* silent */ } finally { setSearchLoading(false) }
    }, 300)
    return () => clearTimeout(delay)
  }, [searchQuery])

  const isActive = (url: string) =>
    url === "/dashboard/admin" || url === "/dashboard/member" || url === "/dashboard/finance"
      || url === "/dashboard/office" || url === "/dashboard/choir"
      || url === "/dashboard/education" || url === "/dashboard/members-affairs"
      ? pathname === url
      : pathname.startsWith(url) && url !== "/"

  return (
    <div className="admin-shell">
      {/* Sidebar Backdrop */}
      <div
        className={`sidebar-backdrop${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar${sidebarOpen ? " sidebar-open" : ""}`} id="adminSidebar" aria-label="Main navigation">
        {/* Brand */}
        <div className="sidebar-header">
          <Link className="brand-mark" href="/" aria-label="Fenot dashboard">
            <span className="brand-icon">
              <BrandIcon size={20} />
            </span>
            <span className="brand-copy">
              <span className="brand-title">Fenot</span>
              <span className="brand-subtitle">{brandSubtitle}</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">{t("sidebar.menu")}</span>
          {navItems.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={`nav-link${isActive(item.url) ? " active" : ""}`}
              aria-current={isActive(item.url) ? "page" : undefined}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon"><item.icon size={15} /></span>
              <span className="nav-text">{item.title}</span>
            </Link>
          ))}

          {secondaryNavItems && (
            <>
              <span className="nav-section-label" style={{ marginTop: "0.5rem" }}>
                {secondaryNavItems.label}
              </span>
              {secondaryNavItems.items.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className={`nav-link${isActive(item.url) ? " active" : ""}`}
                  aria-current={isActive(item.url) ? "page" : undefined}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon"><item.icon size={15} /></span>
                  <span className="nav-text">{item.title}</span>
                </Link>
              ))}
            </>
          )}

          <span className="nav-section-label" style={{ marginTop: "0.5rem" }}>{t("sidebar.account")}</span>
          <Link
            href="/dashboard/change-password"
            className={`nav-link${pathname === "/dashboard/change-password" ? " active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="nav-icon"><Key size={15} /></span>
            <span className="nav-text">{t("common.changePassword")}</span>
          </Link>
          <button className="nav-link" onClick={() => signOut({ callbackUrl: "/login" })}>
            <span className="nav-icon"><LogOut size={15} /></span>
            <span className="nav-text">{t("common.signOut")}</span>
          </button>
        </nav>

        {/* User card */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{userInitials}</div>
          <strong>{userName}</strong>
          <small>{roleLabel}</small>
        </div>

        {/* Footer status */}
        <div className="sidebar-footer">
          <span className="status-dot" />
          <span className="sidebar-footer-text">{t("common.systemStatus")}</span>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        {/* Navbar */}
        <nav className="admin-navbar" aria-label="Top navigation">
          <div className="navbar-inner">
            {/* Hamburger */}
            <button
              className="sidebar-toggle"
              type="button"
              onClick={() => setSidebarOpen(o => !o)}
              aria-controls="adminSidebar"
              aria-expanded={sidebarOpen}
              aria-label="Toggle sidebar"
            >
              <span />
              <span />
              <span />
            </button>

            {/* Search trigger */}
            <button
              className="search-input"
              style={{ cursor: "text" }}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={16} style={{ color: "var(--admin-muted)", flexShrink: 0 }} />
              <span style={{ color: "var(--admin-muted)", fontSize: "0.88rem", flex: 1, textAlign: "left" }}>
                {t("topbar.searchPlaceholder")}
              </span>
              <kbd style={{
                fontSize: "0.7rem", fontWeight: 700,
                background: "var(--admin-surface-soft)",
                border: "1px solid var(--admin-border)",
                borderRadius: 4, padding: "0 0.35rem",
                color: "var(--admin-muted)", flexShrink: 0,
              }}>
                Ctrl K
              </kbd>
            </button>

            {/* Search Dialog */}
            <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
              <CommandInput
                placeholder={t("topbar.searchPlaceholder")}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                {searchLoading && (
                  <div style={{ padding: "1.5rem", textAlign: "center", fontSize: "0.88rem", color: "var(--admin-muted)" }}>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    {t("common.loading")}
                  </div>
                )}
                {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <CommandEmpty>{t("topbar.noResults")} &quot;{searchQuery}&quot;</CommandEmpty>
                )}
                {!searchLoading && searchResults.map((group) => (
                  <CommandGroup key={group.categoryKey} heading={t(group.categoryKey)}>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => { router.push(item.url); setSearchOpen(false); setSearchQuery("") }}
                        className="cursor-pointer flex flex-col items-start gap-1 p-2"
                      >
                        <span className="font-bold text-sm">{item.title}</span>
                        <span className="text-xs" style={{ color: "var(--admin-muted)" }}>{item.subtitle}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </CommandDialog>

            {/* Right actions */}
            <div className="navbar-actions">
              {/* Language toggle */}
              <LanguageToggle />

              {/* Dark mode toggle */}
              <button
                className="icon-button"
                type="button"
                onClick={toggleTheme}
                aria-label="Switch color theme"
                title="Switch color theme"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Notifications */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => setNotifOpen(o => !o)}
                  aria-label="Notifications"
                >
                  <span className="notification-dot" />
                  <Bell size={16} />
                </button>
                {notifOpen && (
                  <div className="dropdown-menu notification-menu">
                    <div style={{ padding: "0.65rem 1rem", fontWeight: 700, fontSize: "0.9rem", color: "var(--admin-text)", borderBottom: "1px solid var(--admin-border)" }}>
                      Notifications
                    </div>
                    <a className="dropdown-item" href="#" onClick={e => e.preventDefault()}>
                      <span className="notification-title">{t("admin.dash.announcements")}</span>
                      <span className="notification-time">Just now</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  className="profile-button"
                  type="button"
                  onClick={() => setProfileOpen(o => !o)}
                  aria-expanded={profileOpen}
                >
                  <span className="profile-avatar">{userInitials}</span>
                  <span className="profile-name">{userName}</span>
                  <ChevronDown size={14} style={{ color: "var(--admin-muted)" }} />
                </button>

                {profileOpen && (
                  <div className="dropdown-menu">
                    <Link
                      href="/dashboard/change-password"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t("common.changePassword")}
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item"
                      style={{ color: "var(--admin-danger)" }}
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      {t("common.signOut")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="dashboard-content">
          <div className="content-container">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="admin-footer">
          <div className="footer-inner">
            <span>© {new Date().getFullYear()} Fenot Church Management System</span>
            <span>{brandTitle} Portal</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
