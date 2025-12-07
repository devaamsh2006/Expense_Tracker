"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Wallet, CreditCard } from "lucide-react"

export function WalletView() {
    const [loading, setLoading] = useState(true)
    const [balances, setBalances] = useState({ cash: 0, online: 0 })
    const [history, setHistory] = useState([])

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
                <CardHeader>
                    <CardTitle>Savings / Income History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No savings recorded yet.</p>
                        ) : (
                            history.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{item.description || "Added Savings"}</p>
                                        <p className="text-sm text-muted-foreground">{item.date} • {item.mode}</p>
                                    </div>
                                    <div className="font-bold text-green-600">
                                        +₹{item.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
