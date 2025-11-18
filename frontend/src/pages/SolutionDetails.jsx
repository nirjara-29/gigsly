import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";


import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";


export function SolutionDetails() {
  const { solutionId } = useParams();
  const [solution, setSolution] = useState(null);
  const { getToken } = useAuth();

useEffect(() => {
  api.getSolutionById(solutionId, getToken)
    .then(setSolution)
    .catch(console.error);
}, [solutionId, getToken]);


console.log("getToken is:", getToken);


  if (!solution) return <p>Loading...</p>;

  const details = solution.ai_details;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{solution.problemTitle}</CardTitle>
          <p>Status: {solution.status}</p>
          <p>AI Score: {details?.score}</p>
        </CardHeader>

        <CardContent className="space-y-6">

          <div>
            <h3 className="font-semibold text-lg">Checklist Results</h3>
            {details?.per_item?.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border ${
                  item.passed ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
                }`}
              >
                <p><strong>Item:</strong> {item.item_id}</p>
                <p><strong>Passed:</strong> {item.passed ? "Yes" : "No"}</p>
                <p><strong>Comment:</strong> {item.comment}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-lg">Recommendations</h3>
            <ul className="list-disc ml-6">
              {details?.recommendations?.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
