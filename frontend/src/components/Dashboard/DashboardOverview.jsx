import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { api } from "../../lib/api";
import { useAuth } from "@clerk/clerk-react";
import {
  FileText,
  CheckCircle,
  DollarSign,
  Clock,
} from "lucide-react";

export function DashboardOverview() {
  const [myProblems, setMyProblems] = useState([]);
  const [mySolutions, setMySolutions] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0); // ⭐ NEW
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [problemsData, solutionsResp] = await Promise.all([
        api.getMyProblems(getToken),
        api.getMySolutions(getToken),
      ]);

      setMyProblems(problemsData);
      setMySolutions(solutionsResp.solutions || []); // ⭐ FIXED
      setTotalEarned(solutionsResp.totalEarned || 0); // ⭐ FIXED
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: "Problems Posted",
      value: myProblems.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      name: "Solutions Submitted",
      value: mySolutions.length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      name: "Total Earned",
      value: `$${totalEarned}`, // ⭐ FIXED
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      name: "Active Projects",
      value:
        myProblems.filter((p) => p.status === "in_progress").length +
        mySolutions.filter((s) => s.status === "pending_review").length,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Recent Problems */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Problems</CardTitle>
            <Link to="/dashboard/problems">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {myProblems.slice(0, 3).map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">
                    {problem.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    ${problem.budget} • {problem.solutionsCount || 0} solutions
                  </p>
                </div>
                <Badge
                  variant={
                    problem.status === "completed" ? "default" : "secondary"
                  }
                >
                  {problem.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
            {myProblems.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No problems posted yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* My Recent Solutions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Solutions</CardTitle>
            <Link to="/dashboard/solutions">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mySolutions.slice(0, 3).map((solution) => (
              <div
                key={solution.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">
                    {solution.problemTitle}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Submitted{" "}
                    {new Date(solution.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={
                    solution.status === "approved"
                      ? "default"
                      : "secondary"
                  }
                >
                  {solution.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
            {mySolutions.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No solutions submitted yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
