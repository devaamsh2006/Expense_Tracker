"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet, User, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const links = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/add-expense", label: "Add Expense" },
        { href: "/add-savings", label: "Add Savings" },
        { href: "/wallet", label: "Wallet" },
        { href: "/chat", label: "AI Assistant" },
    ]

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
            <div className="container flex h-14 items-center max-w-full px-6 lg:px-8">
                {/* Mobile Menu */}
                <div className="md:hidden mr-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <div className="flex flex-col gap-4 py-4">
                                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
                                    <Wallet className="h-6 w-6" />
                                    <span>Expense Tracker</span>
                                </Link>
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:text-primary",
                                            pathname === link.href ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mr-8">
                    <Wallet className="h-6 w-6 hidden md:block" />
                    <span className="hidden md:block">My Expense Tracker</span>
                    <span className="md:hidden">Expense Tracker</span>
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
                    <ModeToggle />
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </nav>
    )
}
