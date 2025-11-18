import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

let socket;

export function ProblemSolutions() {
  const { id } = useParams(); // problemId from URL
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    loadSolutions();
  }, []);


  const loadSolutions = async () => {
    try {
      const data = await api.getProblemSolutions(id, getToken);
      setSolutions(data);
    } catch (error) {
      console.error("Error loading solutions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading solutions...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Page Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center">
          Solutions for Problem{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            #{id}
          </span>
        </h1>

        {solutions.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No solutions submitted yet.
          </p>
        ) : (
          <div className="grid gap-8">
            {solutions.map((s) => (
              <Card
                key={s.id}
                className="rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
              >
                {/* Header */}
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {s.freelancerName}
                    </CardTitle>
                    <Badge
  className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
    s.status === "accepted_by_ai"
      ? "bg-green-100 text-green-700 border border-green-200"
      : s.status === "needs_fix"
      ? "bg-red-100 text-red-700 border border-red-200"
      : s.status === "pending_review"
      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
      : "bg-gray-100 text-gray-700 border border-gray-200"
  }`}
>
  {s.status}
</Badge>

                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="space-y-5 pt-4">
                  <p className="text-base text-gray-700 leading-relaxed">
                    {s.explanation}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
  AI Score: <span className="text-blue-600">{s.ai_score ?? "N/A"}</span>
</p>


                  {/* Attachments */}
                  {s.attachments && s.attachments.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Attachments
                      </h3>
                      <div className="flex flex-wrap gap-4 hover:shadow-2xl mb-5 mt-4">
                        {s.attachments.map((url, idx) => {
                          const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group"
                            >
                              {isImage ? (
                                <img
                                  src={url}
                                  alt={`attachment-${idx}`}
                                  className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:opacity-90 transition"
                                />
                              ) : (
                                <div className="px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg shadow-sm group-hover:bg-gray-100 transition">
                                  📎 File {idx + 1}
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    
                 <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/chat/${id}/${user.id}/${s.freelancerId}`)
                      }
                    >
                      Chat with {s.freelancerName}
                  </Button>
                  </div>
                  {/* Release Payment button - only visible for approved solutions */}
{s.status === "accepted_by_ai" && (
  <Button
    variant="default"
    size="sm"
    className="bg-green-600 text-white hover:bg-green-700"
    onClick={async () => {
      try {
        if (!window.confirm("Release payment to freelancer?")) return;

        // send problemId + freelancer ID
        const resp = await api.releasePayment(id, s.userId, getToken);

        alert("Payment released successfully!");
        loadSolutions();
      } catch (err) {
        alert(err.message || "Payment release failed");
      }
    }}
  >
    Release Payment
  </Button>
)}


                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
