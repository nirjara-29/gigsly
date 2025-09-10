import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { PostProblemForm } from '../components/PostProblemForm';
import { ProblemCard } from '../components/ProblemCard';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function Home() {
  const { isSignedIn } = useUser();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      loadProblems();
    }
  }, [isSignedIn]);
  
  const loadProblems = async () => {
    try {
      const data = await api.getProblems();
      console.log("Fetched problems:", data);
      setProblems(data);
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* 🔥 Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
        >
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag...
        </video>
  
        {/* 🔥 Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>
  
        {/* 🔥 Foreground Content */}
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
            Welcome to Gigsly
          </h1>
          <p className="mb-8 text-gray-300 text-lg md:text-xl max-w-xl mx-auto">
            Sign in or create an account to explore, post problems, and connect with top developers.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link to="/sign-in">
              <Button className="px-6 py-3 rounded-xl text-lg font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform">
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                variant="outline"
                className="px-6 py-3 rounded-xl text-lg font-semibold border-2 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white transition-colors hover:scale-105 shadow-lg"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Solve Problems, Earn Money
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with skilled developers to solve your coding challenges
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Problems List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Available Problems</h2>
            <div className="text-sm text-gray-500">
              {problems.length} problems available
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : problems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No problems posted yet</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
