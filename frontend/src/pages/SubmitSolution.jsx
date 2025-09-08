import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Upload, FileCode, X } from "lucide-react";
import { api } from "../lib/api";

export function SubmitSolution() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [explanation, setExplanation] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!explanation || files.length === 0) return;

    setIsSubmitting(true);
    try {
      await api.submitSolution(problemId, explanation, files, getToken);
      alert("Solution submitted successfully!");
      navigate("/dashboard/solutions");
    } catch (err) {
      alert(err.message || "Error submitting solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit Solution</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileCode className="h-5 w-5" />
              <span>Solution Submission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain your approach and technologies used..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Code Files</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.md,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="code-upload"
                  />
                  <label htmlFor="code-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Upload your solution files
                    </p>
                  </label>
                </div>

                {files.length > 0 &&
                  files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileCode className="h-4 w-4 text-blue-600" />
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>

              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || files.length === 0}>
                  {isSubmitting ? "Submitting..." : "Submit Solution"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
