"use client"

import { AddSavingsForm } from "@/components/AddSavingsForm"
import { useRouter } from "next/navigation"

export default function AddSavingsPage() {
    const router = useRouter()
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Add Savings</h1>
            <AddSavingsForm onSuccess={() => router.push('/wallet')} />
        </div>
    )
}
