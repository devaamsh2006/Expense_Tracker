"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"

const MODES = ["Cash", "Online"]

export function AddSavingsForm({ onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        amount: "",
        mode: "Cash",
        description: "",
        date: new Date().toISOString().split('T')[0]
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('savings')
                .insert([
                    {
                        amount: parseFloat(formData.amount),
                        mode: formData.mode,
                        description: formData.description,
                        date: formData.date,
                        created_at: new Date().toISOString()
                    }
                ])

            if (error) throw error

            setFormData({
                amount: "",
                mode: "Cash",
                description: "",
                date: new Date().toISOString().split('T')[0]
            })

            alert("Savings added successfully!")
            if (onSuccess) onSuccess()

        } catch (error) {
            console.error('Error adding savings:', error)
            alert('Error adding savings. Make sure the "savings" table exists in Supabase.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Savings / Income</CardTitle>
                <CardDescription>Record money added to your wallet or bank.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount</label>
                            <Input
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mode</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.mode}
                                onChange={e => setFormData({ ...formData, mode: e.target.value })}
                            >
                                {MODES.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Source of income..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Savings"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
