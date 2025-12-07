"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ChatPanel() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm your AI financial assistant. How can I help you today?" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { role: "user", content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            })
            const data = await response.json()

            setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
        } catch (error) {
            console.error("Failed to send message", error)
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-xl z-50 lg:hidden",
                    isOpen ? "hidden" : "flex"
                )}
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>

            {/* Chat Panel */}
            <div className={cn(
                "fixed right-0 top-14 bottom-0 w-full sm:w-80 border-l bg-background flex-col shadow-lg z-40 transition-transform duration-300 ease-in-out",
                isOpen ? "flex translate-x-0" : "hidden translate-x-full lg:flex lg:translate-x-0"
            )}>
                <div className="p-4 border-b flex items-center justify-between font-semibold bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        AI Expense Assistant
                    </div>
                    {/* Close button for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-8 w-8"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 border", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary")}>
                                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={cn("rounded-lg p-3 text-sm max-w-[80%]", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-muted rounded-lg p-3 text-sm animate-pulse">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-background">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your spending..."
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Mobile Overlay (optional, closes chat when clicked outside) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
