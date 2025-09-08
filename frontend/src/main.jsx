import './index.css'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

// ✅ Use publishableKey instead of frontendApi
const clerkPublishableKey = import.meta.env.VITE_CLERK_FRONTEND_API;

if (!clerkPublishableKey) {
  console.error("❌ Clerk Publishable Key is missing!");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <App />
  </ClerkProvider>
);
