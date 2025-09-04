import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

// export function SignIn() {
//   return (
//     <div className="min-h-screen bg-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
//           <p className="mt-2 text-gray-600">Sign in to your Gigsly account</p>
//         </div>
//         <ClerkSignIn 
//           routing="path" 
//           path="/sign-in" 
//           signUpUrl="/sign-up"
//           redirectUrl="/dashboard"
//         />
//       </div>
//     </div>
//   );
// }
// import React from 'react';
// import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export function SignIn() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      

      {/* 🔥 Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* 🔥 Sign In Box */}
      <div className="relative z-10 w-full max-w-md px-6 py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400">Sign in to your Gigsly account</p>
        </div>
        <ClerkSignIn 
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "bg-transparent", // 🔥 Entire widget transparent
              card: "bg-transparent shadow-none border-none", // 🔥 No background
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
              socialButtonsVariant: "blockButton"
            }
          }}
        />
      </div>
    </div>
  );
}
