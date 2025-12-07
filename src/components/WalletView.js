"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wallet, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function WalletView() {
    const [loading, setLoading] = useState(true)
    const [balances, setBalances] = useState({ cash: 0, online: 0 })
    const [history, setHistory] = useState([])
    const [visibleCount, setVisibleCount] = useState(10)
    const [filterMode, setFilterMode] = useState("All")
    const [filterDate, setFilterDate] = useState("")

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch Savings
            const { data: savings, error: savingsError } = await supabase
                .from('savings')
                .select('*')
                .order('date', { ascending: false })

            if (savingsError) throw savingsError

            // Fetch Expenses
            const { data: expenses, error: expensesError } = await supabase
                .from('expenses')
                .select('*')

            if (expensesError) throw expensesError

            // Calculate Balances
            let cashIn = 0, onlineIn = 0
            let cashOut = 0, onlineOut = 0

            savings?.forEach(s => {
                if (s.mode === 'Cash') cashIn += s.amount
                else onlineIn += s.amount
            })

            expenses?.forEach(e => {
                // Default to Cash if payment_mode is missing (legacy data)
                const mode = e.payment_mode || 'Cash'
                if (mode === 'Cash') cashOut += e.amount
                else onlineOut += e.amount
            })

            setBalances({
                cash: cashIn - cashOut,
                online: onlineIn - onlineOut
            })

            setHistory(savings || [])

        } catch (error) {
            console.error('Error fetching wallet data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Filter History
    const filteredHistory = history.filter(item => {
        const matchesMode = filterMode === "All" || item.mode === filterMode
        const matchesDate = !filterDate || item.date === filterDate
        return matchesMode && matchesDate
    })

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{balances.cash.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online Balance</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{balances.online.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Savings / Income History</CardTitle>
                    <div className="flex gap-2">
                        <select
                            className="h-9 w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value)}
                        >
                            <option value="All">All Modes</option>
                            <option value="Cash">Cash</option>
                            <option value="Online">Online</option>
                        </select>
                        <Input
                            type="date"
                            className="w-[150px]"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                        {(filterMode !== "All" || filterDate) && (
                            <Button variant="ghost" size="sm" onClick={() => { setFilterMode("All"); setFilterDate(""); }}>
                                Clear
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredHistory.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No savings recorded yet matching filters.</p>
                        ) : (
                            <>
                                {filteredHistory.slice(0, visibleCount).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{item.description || "Added Savings"}</p>
                                            <p className="text-sm text-muted-foreground">{item.date} • {item.mode}</p>
                                        </div>
                                        <div className="font-bold text-green-600">
                                            +₹{item.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                {visibleCount < filteredHistory.length && (
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={() => setVisibleCount(prev => prev + 10)}
                                    >
                                        View More
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
