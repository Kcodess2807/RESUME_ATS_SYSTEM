import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'

// Read the Clerk Publishable Key from the .env file
// Vite exposes env variables prefixed with VITE_ via import.meta.env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// If the key is missing, throw a helpful error instead of a confusing one
if (!PUBLISHABLE_KEY) {
  throw new Error(
    'Clerk Publishable Key is missing!\n' +
    'Create a .env file in the frontend/ folder and add:\n' +
    'VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here\n' +
    'Get your key from https://dashboard.clerk.com'
  )
}

// ReactDOM.createRoot() mounts React into the <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode helps catch bugs during development
  // It runs certain checks twice in development (not in production)
  <React.StrictMode>

    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>

  </React.StrictMode>
)
