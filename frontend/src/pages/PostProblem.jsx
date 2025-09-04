// src/pages/PostProblem.jsx
import React from "react";
import { PostProblemForm } from "../components/PostProblemForm";

export default function PostProblem() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Post Your Problem</h1>
      <PostProblemForm />
    </div>
  );
}
