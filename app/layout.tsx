import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans, Noto_Sans_Ethiopic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  display: "swap",
  variable: "--font-noto-ethiopic",
})

export const metadata: Metadata = {
  title: "የቡራዩ ደ/ሰላም መድ Hannahዓለም ካቴድራል ፍኖተ ሰላም ሰንበት ት/ቤት | Buraayu D/Selam Sunday School",
  description:
    "የቡራዩ ደ/ሰላም መድ Hannahዓለም ካቴድራል ፍኖተ ሰላም ሰንበት ት/ቤት - Growing in faith, wisdom, and service | የእምነት እውቀት እና አገልግሎት ማሻሻያ",
  keywords: "Ethiopian Orthodox, Sunday School, Buraayu, Cathedral, ሰንበት ት/ቤት, መድ Hannahዓለም",
  authors: [{ name: "Fnote Selam Sunday School" }],
  creator: "የቡራዩ ደ/ሰላም መድ Hannahዓለም ካቴድራል",
  openGraph: {
    title: "Fnote Selam Sunday School | ፍኖተ ሰላም ሰንበት ት/ቤት",
    description: "Growing in faith, wisdom, and service | የእምነት እውቀት እና አገልግሎት ማሻሻያ",
    type: "website",
    locale: "en_US",
    alternateLocale: "am_ET",
  },
  generator: 'v0.app'
}

import { AuthProvider } from "@/components/providers/auth-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} ${notoEthiopic.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LanguageProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
