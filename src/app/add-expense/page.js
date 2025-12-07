"use client"

import { AddExpenseForm } from "@/components/AddExpenseForm"
import { useRouter } from "next/navigation"

export default function AddExpensePage() {
    const router = useRouter()
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
            <AddExpenseForm onSuccess={() => router.push('/dashboard')} />
        </div>
    )
}
