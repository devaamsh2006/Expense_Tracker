"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
    const pathname = usePathname()

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/add-expense", label: "Add Expense" },
        { href: "/add-savings", label: "Add Savings" },
        { href: "/wallet", label: "Wallet" },
    ]

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
            <div className="container flex h-14 items-center max-w-full px-4 lg:px-8">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mr-8">
                    <Wallet className="h-6 w-6" />
                    <span>My Expense Tracker</span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === link.href ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </nav>
    )
}
