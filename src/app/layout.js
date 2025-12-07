import "./globals.css"
import { Navbar } from "@/components/Navbar"

export const metadata = {
  title: "My Expense Tracker",
  description: "Track your personal expenses with AI",
  icons: {
    icon: '/icon.png',
  },
}

import { ToastProvider } from "@/context/ToastContext"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Navbar />
            <div className="flex relative">
              <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-3.5rem)]">
                {children}
              </main>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
