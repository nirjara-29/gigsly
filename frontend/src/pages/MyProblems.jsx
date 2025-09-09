import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { FileText, Calendar, DollarSign, Users } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { api } from "../lib/api";
export function MyProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const { getToken } = useAuth(); // token from Clerk
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (isSignedIn) loadMyProblems();

    // loadMyProblems();
  }, [isSignedIn]);
  // MyProblems.jsx
const loadMyProblems = async () => {
  try {
    // console.log(getToken);
    const data = await api.getMyProblems(getToken); // pass getToken function
    setProblems(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("❌ Error loading problems:", err);
    setError("Failed to load your problems. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "payment_released": return "bg-purple-100 text-purple-800";
      case "pending": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p>Loading your problems...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Problems</h1>
      {problems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>No problems posted yet</p>
            <Button asChild>
              <a href="/">Post a Problem</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {problems.map((problem) => (
            <Card key={problem.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{problem.title}</CardTitle>
                    <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(problem.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${problem.budget}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{problem.solutions_count || 0} solutions</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(problem.status)}>
                    {problem.status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/dashboard/problems/${problem.id}`}>View Details</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/dashboard/problems/${problem.id}/solutions`}>View Solutions</a>
                  </Button>
                  {problem.status === "completed" && <Button size="sm">Release Payment</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}