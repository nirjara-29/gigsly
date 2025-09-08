import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Calendar, DollarSign, FileText } from "lucide-react";

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const data = await api.getProblem(id);
        setProblem(data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProblem();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading problem details...
      </div>
    );

  if (!problem)
    return (
      <div className="text-center mt-20 text-red-500">Problem not found</div>
    );

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const attachments = Array.isArray(problem.attachment_url)
    ? problem.attachment_url
    : problem.attachment_url
    ? [problem.attachment_url]
    : [];

  const statusLower = problem.status?.toLowerCase() || "";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-xl rounded-2xl mt-10 border border-gray-200 transition-all duration-300 hover:shadow-2xl">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-3 text-gray-900 tracking-tight">
        {problem.title || "Untitled"}
      </h1>
  
      {/* Status */}
      <span
        className={`inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-semibold tracking-wide shadow-sm ${
          statusLower === "open" || statusLower === "pending"
            ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900"
            : statusLower === "completed"
            ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900"
            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900"
        }`}
      >
        {formatStatus(problem.status)}
      </span>
  
      {/* Description */}
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        {problem.description || "No description"}
      </p>
  
      {/* Budget & Deadline */}
      <div className="flex flex-wrap gap-8 mb-8">
        <div className="flex items-center space-x-3 text-gray-700 text-lg">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span className="font-semibold">${problem.budget ?? 0}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-700 text-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="font-medium">
            {problem.deadline
              ? new Date(problem.deadline).toLocaleDateString()
              : "No deadline"}
          </span>
        </div>
      </div>
  
      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Attachments
          </h2>
          <div className="space-y-3">
            {attachments.map((file, i) => {
              const cleanFile = file.replace(/^["[\]]+|["\]]+$/g, "");
              return (
                <a
                  key={i}
                  href={`http://localhost:5000/uploads/${cleanFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200"
                >
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">
                    {cleanFile.split("/").pop()}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      )}
  
      {/* Submit Solution Button */}
      {(statusLower === "open" || statusLower === "pending") && (
        <div className="mt-6">
          <Link to={`/submit-solution/${problem.id}`}>
            <Button className="w-full text-lg font-semibold py-3 rounded-lg shadow-md bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition duration-300">
              Submit Solution
            </Button>
          </Link>
        </div>
      )}

      {/* Chat Button */}
<div className="mt-4">
  <Link to={`/chat/${problem.id}`} state={{ problem }}>
    <Button className="w-full text-lg font-semibold py-3 rounded-lg shadow-md bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white transition duration-300">
      Chat with Poster
    </Button>
  </Link>
</div>

    </div>
  );
  
}
