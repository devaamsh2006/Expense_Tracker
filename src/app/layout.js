import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { ChatPanel } from "@/components/ChatPanel"

export const metadata = {
  title: "My Expense Tracker",
  description: "Track your personal expenses with AI",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <div className="flex relative">
          <main className="flex-1 p-4 lg:p-8 lg:mr-80 min-h-[calc(100vh-3.5rem)]">
            {children}
          </main>
          <ChatPanel />
        </div>
      </body>
    </html>
  )
}
