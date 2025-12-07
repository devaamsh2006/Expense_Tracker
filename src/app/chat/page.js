"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function ChatPage() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm your AI financial assistant. I can help you analyze your expenses, track your savings, and give you financial insights. What's on your mind?" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

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
        <div className="h-full flex flex-col max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">AI Financial Assistant</h1>
                    <p className="text-muted-foreground">Ask questions about your spending and savings</p>
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden shadow-md border-muted">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20" ref={scrollRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-4", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"
                            )}>
                                {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-primary" />}
                            </div>
                            <div className={cn(
                                "rounded-2xl p-5 text-base leading-relaxed shadow-sm max-w-[85%]",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-card border rounded-tl-none"
                            )}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center shrink-0 border shadow-sm">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div className="bg-card border rounded-2xl rounded-tl-none p-5 shadow-sm">
                                <div className="flex gap-1 items-center h-6">
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-background border-t">
                    <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl mx-auto">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            disabled={isLoading}
                            className="h-12 text-base shadow-sm"
                        />
                        <Button type="submit" size="icon" disabled={isLoading} className="h-12 w-12 shadow-sm">
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}
