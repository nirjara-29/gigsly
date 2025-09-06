import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { MyProblems } from './pages/MyProblems';
import { MySolutions } from './pages/MySolutions';
import { SubmitSolution } from './pages/SubmitSolution';
import { Chat } from './pages/Chat';
import { Payments } from './pages/Payments';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import PostProblem from './pages/PostProblem';
import ProblemDetails from './pages/ProblemDetails';




// Mock Clerk publishable key - replace with your actual key
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }) {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
            <Route path="/post-problem" element={<PostProblem />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="problems" element={<MyProblems />} />
              <Route path="solutions" element={<MySolutions />} />
            </Route>
            
            <Route 
              path="/submit-solution/:problemId" 
              element={
                <ProtectedRoute>
                  <SubmitSolution />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/chat/:problemId?" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              } 
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
