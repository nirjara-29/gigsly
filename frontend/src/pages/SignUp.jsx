import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export function SignUp() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* 🔥 Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* 🔥 Sign Up Box */}
      <div className="relative z-10 w-full max-w-md px-6 py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Join Gigsly
          </h2>
          <p className="mt-2 text-gray-400">Create your account to start solving problems</p>
        </div>

        <ClerkSignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "bg-transparent", // 🔥 Transparent background
              card: "bg-transparent shadow-none border-none", // 🔥 No card background
              formButtonPrimary:
                "bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform",
              footer: "bg-transparent text-gray-400",
              formFieldInput:
                "bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-500",
              formFieldLabel: "text-gray-300",
              socialButtonsBlockButton:
                "bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
              dividerLine: "bg-gray-700",
              dividerText: "text-gray-400",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
            layout: {
              showOptionalFields: false,
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "blockButton",
            },
          }}
        />
      </div>
    </div>
  );
}
