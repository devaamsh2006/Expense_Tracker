"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loader2, DollarSign, Calendar, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function Dashboard() {
    const [expenses, setExpenses] = useState([])
    const [savings, setSavings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterCategory, setFilterCategory] = useState("All")
    const [filterPaymentMode, setFilterPaymentMode] = useState("All")
    const [filterDate, setFilterDate] = useState("")
    const [visibleCount, setVisibleCount] = useState(10)

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch Expenses
            let query = supabase.from('expenses').select('*').order('date', { ascending: false })
            if (filterCategory !== "All") {
                query = query.eq('category', filterCategory)
            }
            const { data: expensesData, error: expensesError } = await query
            if (expensesError) throw expensesError
            setExpenses(expensesData || [])

            // Fetch Savings for Balance Calc
            const { data: savingsData, error: savingsError } = await supabase.from('savings').select('*')
            if (savingsError) throw savingsError
            setSavings(savingsData || [])

        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filterCategory])

    // Calculate stats
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
    const totalSavings = savings.reduce((sum, item) => sum + item.amount, 0)
    const currentBalance = totalSavings - totalExpenses

    const currentMonth = new Date().getMonth()
    const monthlyTotal = expenses
        .filter(item => new Date(item.date).getMonth() === currentMonth)
        .reduce((sum, item) => sum + item.amount, 0)

    // Prepare chart data
    const expensesByDate = expenses.reduce((acc, item) => {
        const date = item.date
        acc[date] = (acc[date] || 0) + item.amount
        return acc
    }, {})

    const lineChartData = Object.entries(expensesByDate)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    const expensesByCategory = expenses.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount
        return acc
    }, {})

    const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }))

    // Filtered Expenses for List
    const filteredExpensesList = expenses.filter(expense => {
        const matchesMode = filterPaymentMode === "All" || expense.payment_mode === filterPaymentMode
        const matchesDate = !filterDate || expense.date === filterDate
        return matchesMode && matchesDate
    })

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (expenses.length === 0 && savings.length === 0) {
        return (
            <div className="text-center p-12 border rounded-lg bg-muted/10">
                <h3 className="text-lg font-semibold">No data yet</h3>
                <p className="text-muted-foreground">Add expenses or savings to see statistics.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{currentBalance.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{monthlyTotal.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expenses.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Expenses Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(str) => format(new Date(str), 'MMM d')} />
                                <YAxis />
                                <Tooltip labelFormatter={(str) => format(new Date(str), 'MMM d, yyyy')} />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Expenses by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex gap-2">
                        <select
                            className="h-9 w-[120px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={filterPaymentMode}
                            onChange={(e) => setFilterPaymentMode(e.target.value)}
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
                        {(filterPaymentMode !== "All" || filterDate) && (
                            <Button variant="ghost" size="sm" onClick={() => { setFilterPaymentMode("All"); setFilterDate(""); }}>
                                Clear
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredExpensesList.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No transactions found matching filters.</p>
                        ) : (
                            <>
                                {filteredExpensesList.slice(0, visibleCount).map((expense) => (
                                    <div key={expense.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{expense.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(expense.date), 'MMM d, yyyy')} • {expense.category} • {expense.payment_mode || 'Cash'}
                                            </p>
                                        </div>
                                        <div className="font-bold">
                                            ₹{expense.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                {visibleCount < filteredExpensesList.length && (
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
