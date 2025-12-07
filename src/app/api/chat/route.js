import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const openRouterKey = process.env.OPENROUTER_API_KEY
const HttpRef = process.env.NEXT_HTTP_REFFER;

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export async function POST(req) {
    try {
        const { message } = await req.json()

        // 1. Fetch relevant data from Supabase to give the AI context
        const { data: expenses, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .order('date', { ascending: false })

        const { data: savings, error: savingsError } = await supabase
            .from('savings')
            .select('*')
            .order('date', { ascending: false })

        if (expensesError || savingsError) {
            console.error("Database error:", expensesError || savingsError)
            return NextResponse.json({ reply: "I'm having trouble accessing your financial data right now." })
        }

        // 2. Construct the context for the AI
        const contextData = {
            expenses: expenses || [],
            savings: savings || [],
            summary: {
                total_expenses: expenses?.reduce((sum, item) => sum + item.amount, 0) || 0,
                total_savings: savings?.reduce((sum, item) => sum + item.amount, 0) || 0,
            },
            current_date: new Date().toISOString().split('T')[0],
            currency: "INR (₹)"
        }

        const systemPrompt = `You are a helpful and intelligent financial assistant for a personal expense tracker app. 
    You have access to the user's recent financial data (last 50 expenses and 20 savings entries) in JSON format below.
    
    Context Data:
    ${JSON.stringify(contextData, null, 2)}
    
    Instructions:
    1. Answer the user's question based on the provided data.
    2. If they ask about totals, spending habits, or specific categories, calculate the answer from the data.
    3. Use the currency symbol ₹ (Rupee) for all monetary values.
    4. Keep your responses concise, friendly, and helpful.
    5. If the user asks something not related to the data or general financial advice, answer to the best of your ability as an AI assistant.
    6. Do not mention "JSON data" or "context" explicitly to the user; just act as if you know their finances.`

        // 3. Call OpenRouter API
        if (!openRouterKey) {
            console.warn("OPENROUTER_API_KEY is missing")
            return NextResponse.json({ reply: "I can't connect to my brain (OpenRouter API Key missing). Please check your settings." })
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": HttpRef,
                "X-Title": "Expense Tracker"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": message }
                ]
            })
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error("OpenRouter API Error:", errText)
            throw new Error(`OpenRouter API Error: ${response.statusText}`)
        }

        const data = await response.json()
        const reply = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

        return NextResponse.json({ reply })

    } catch (error) {
        console.error('Chat API Error:', error)
        return NextResponse.json({ reply: "Sorry, something went wrong while processing your request." }, { status: 500 })
    }
}
