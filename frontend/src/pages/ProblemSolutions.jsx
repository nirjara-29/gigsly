import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

export function ProblemSolutions() {
  const { id } = useParams(); // problemId from URL
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSolutions();
  }, []);

  const loadSolutions = async () => {
    try {
      const data = await api.getProblemSolutions(id);
      setSolutions(data);
    } catch (error) {
      console.error("Error loading solutions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading solutions...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Solutions for Problem #{id}</h1>

      {solutions.length === 0 ? (
        <p className="text-gray-600">No solutions submitted yet.</p>
      ) : (
        <div className="grid gap-6">
          {solutions.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{s.freelancerName}</CardTitle>
                  <Badge>{s.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{s.explanation}</p>
                <div className="mt-2 flex space-x-2">
                  <Button variant="outline" size="sm">View Submission</Button>
                  <Button variant="outline" size="sm">Open Chat</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
