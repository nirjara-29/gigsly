import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { MyProblems } from './pages/MyProblems';
import { MySolutions } from './pages/MySolutions';
import { SubmitSolution } from './pages/SubmitSolution';
import { Payments } from './pages/Payments';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import PostProblem from './pages/PostProblem';
import ProblemDetails from './pages/ProblemDetails';
import { ProblemSolutions } from './pages/ProblemSolutions';
import { ChatPage } from './pages/ChatPage';
import { SolutionChatPage } from './pages/SolutionChatPage';

function ProtectedRoute({ children }) {
  return <SignedIn>{children}</SignedIn>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />
          <Route path="/post-problem" element={<PostProblem />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard/problems/:id/solutions" element={<ProblemSolutions />} />

          <Route
            path="/chat/:problemId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/solution/:solutionId"
            element={
              <ProtectedRoute>
                <SolutionChatPage />
              </ProtectedRoute>
            }
          />
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
  );
}

export default App;
