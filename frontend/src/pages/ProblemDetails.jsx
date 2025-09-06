import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // import Link
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

  const formatStatus = (status) =>
    status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const attachments = Array.isArray(problem.attachment_url)
    ? problem.attachment_url
    : problem.attachment_url
    ? [problem.attachment_url]
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>

      {/* Status */}
      <span
        className={`inline-block px-3 py-1 mb-4 rounded-full text-sm font-medium ${
          problem.status.toLowerCase() === "open" || problem.status.toLowerCase() === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : problem.status.toLowerCase() === "completed"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {formatStatus(problem.status)}
      </span>

      {/* Description */}
      <p className="text-gray-700 mb-6">{problem.description}</p>

      {/* Budget & Deadline */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <DollarSign className="h-5 w-5" />
          <span className="font-medium">${problem.budget}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-5 w-5" />
          <span>{new Date(problem.deadline).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Attachments</h2>
          {attachments.map((file, i) => (
            <a
              key={i}
              href={`http://localhost:5000/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50 transition"
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{file.split("/").pop()}</span>
            </a>
          ))}
        </div>
      )}

      {/* Submit Solution Button */}
      {(problem.status.toLowerCase() === "open" || problem.status.toLowerCase() === "pending") && (
        <div className="mt-4">
          <Link to={`/submit-solution/${problem.id}`}>
            <Button className="w-full text-lg font-semibold">
              Submit Solution
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
