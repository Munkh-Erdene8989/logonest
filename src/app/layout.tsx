import type { Metadata } from "next"
import { Golos_Text, JetBrains_Mono } from "next/font/google"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MotionStack } from "@/components/motion/Providers"
import "./globals.css"

const golos = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-golos",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "LOGONEST — Хэвлэлийн газар",
    template: "%s · LOGONEST",
  },
  description:
    "Нэрийн хуудаснаас том баннер хүртэл — чанартай хэвлэл, ил тод үнэ, шуурхай хугацаа.",
  icons: { icon: "/favicon.svg" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`dark ${golos.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=JSON.parse(localStorage.getItem('hg_theme')||'"dark"');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <MotionStack>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </MotionStack>
      </body>
    </html>
  )
}
