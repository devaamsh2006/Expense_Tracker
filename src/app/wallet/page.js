"use client"

import { WalletView } from "@/components/WalletView"

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
            <WalletView />
        </div>
    )
}
