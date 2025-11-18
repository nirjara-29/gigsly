import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { api } from '../lib/api';
import { CheckCircle, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";

export function MySolutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

 useEffect(() => {
  const fetchSolutions = async () => {
    try {
      const data = await api.getMySolutions(getToken);

      // FIX HERE
      setSolutions(data.solutions || []);

    } catch (err) {
      console.error("❌ Failed to load solutions:", err);

      // fallback to empty list
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  fetchSolutions();
}, [getToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'needs_revision': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Solutions</h1>
        <p className="text-gray-600 mt-2">Track the status of solutions you've submitted</p>
      </div>

      {solutions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No solutions submitted yet</h3>
            <p className="text-gray-500 mb-4">Browse available problems and submit your first solution</p>
            <Button asChild>
              <a href="/">Browse Problems</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {solutions.map((solution) => (
  <Link
    key={solution.id}
    to={`/dashboard/solutions/${solution.id}`}
    className="block"
  >
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{solution.problemTitle}</CardTitle>

            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Submitted {new Date(solution.submittedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>${solution.payment}</span>
              </div>
            </div>
          </div>

          <Badge className={getStatusColor(solution.status)}>
            {solution.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  </Link>
))}

        </div>
      )}
    </div>
  );
}
