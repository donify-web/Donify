# Donify - Democratic Micro-Donations Platform

Donify is a modern web platform that democratizes philanthropy. Users donate small amounts ("micro-subscriptions"), vote collectively on causes, and the funds are transferred directly to the winning organization.

![Donify Hero](https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1000)

## 🚀 Vision

> "Your loose change changes the world."

*   **Democrat ic:** Every donor has a vote.
*   **Transparent:** Radical transparency on fees and fund destination.
*   **Simple:** Subscriptions starting at €0.99/month.

## 🛠 Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS (CDN/Built-in)
*   **Icons:** Lucide React
*   **Backend / Auth:** Supabase
*   **Payments:** Stripe (Simulated logic implemented)

## 📂 Project Structure

*   `index.tsx`: Entry point.
*   `App.tsx`: Main routing and authentication state manager.
*   `components/`: Reusable UI components (Landing, Dashboard, Login, etc.).
*   `lib/`: External services configuration (Supabase).
*   `types.ts`: TypeScript interfaces for Users, Organizations, and Tiers.

## ⚡️ Quick Start

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

## 🔐 Environment Variables

This project uses **Supabase** for backend services. Ensure you have the correct keys in `lib/supabaseClient.ts` or move them to a `.env` file for production security.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## © License

Private project. Created for Donify Initiative.
