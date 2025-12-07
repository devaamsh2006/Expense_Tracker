# AI Expense Tracker

A modern, full-stack expense tracking application built with **Next.js**, **Supabase**, and **AI integration**. Track your expenses, manage your savings, and get intelligent financial insights from a Llama 3.3 powered AI assistant.

## 🚀 Features

-   **Dashboard**: Visual overview of your finances with charts (Recharts) and recent transactions.
-   **Expense Tracking**: Add expenses with categories, payment modes, and dates.
-   **Savings Management**: Track your income and savings history.
-   **Wallet View**: See your current Cash vs. Online balances.
-   **AI Assistant**: A dedicated chat interface powered by **Llama 3.3 (via OpenRouter)** that knows your financial context and can answer questions like "How much did I spend on food this month?".
-   **Smart Filtering**: Filter transactions by Date and Payment Mode.
-   **Responsive Design**: Fully responsive UI with a mobile-friendly navigation and chat panel.
-   **Dark/Light Mode**: Seamless theme switching support.
-   **Toast Notifications**: Sleek user feedback for actions.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
-   **UI Components**: Shadcn UI, Lucide React
-   **Backend / Database**: Supabase (PostgreSQL)
-   **AI Integration**: OpenRouter API (Meta Llama 3.3 70B Instruct)
-   **Charts**: Recharts
-   **State Management**: React Hooks & Context API

## ⚙️ Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/expense-tracker.git
    cd expense-tracker
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    OPENROUTER_API_KEY=your_openrouter_api_key
    NEXT_HTTP_REFFER=http://localhost:3000
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app.

## 🗄️ Database Schema (Supabase)

### `expenses` Table
-   `id` (uuid, primary key)
-   `title` (text)
-   `amount` (numeric)
-   `category` (text)
-   `payment_mode` (text) - 'Cash' or 'Online'
-   `date` (date)
-   `description` (text)
-   `created_at` (timestamp)

### `savings` Table
-   `id` (uuid, primary key)
-   `amount` (numeric)
-   `mode` (text) - 'Cash' or 'Online'
-   `description` (text)
-   `date` (date)
-   `created_at` (timestamp)

## 🤖 AI Integration Details

The application uses the **OpenRouter API** to connect to the `meta-llama/llama-3.3-70b-instruct:free` model.
-   **Context Injection**: Before sending a user's message to the AI, the backend fetches the user's recent expenses and savings from Supabase.
-   **System Prompt**: A dynamic system prompt is constructed with this financial data, instructing the AI to act as a financial assistant and use the Rupee (₹) symbol.

## 🎨 UI/UX

-   **Glassmorphism**: Subtle transparency and blur effects in the navbar.
-   **Animations**: Smooth transitions for the chat panel and toast notifications.
-   **Theme**: Support for both light and dark modes, respecting system preferences.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
