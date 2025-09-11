import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Calendar, DollarSign } from 'lucide-react';

export function ProblemCard({ problem }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/problems/${problem.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

 const formatStatus = (status) => {
  if (!status) return "open";
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};


return (
  <Card
    className="h-full rounded-2xl border border-transparent bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    onClick={handleClick}
  >
    {/* Gradient Header */}
    <CardHeader className="p-6 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md">
  <div className="flex justify-between items-start">
    <CardTitle className="text-2xl font-extrabold text-white drop-shadow-md leading-snug line-clamp-2">
      {problem.title}
    </CardTitle>
    <Badge
      className={`${getStatusColor(
        problem.status
      )} text-xs font-semibold px-3 py-1 rounded-full shadow-lg bg-white/80 backdrop-blur-sm border border-white/20`}
    >
      {formatStatus(problem.status)}
    </Badge>
  </div>
</CardHeader>


    {/* Content */}
    <CardContent className="p-5 space-y-5">
      <p className="text-gray-700 text-xl font-bold leading-relaxed line-clamp-3">
        {problem.description}
      </p>

      {/* Attachments */}
      {Array.isArray(problem.attachment_url)
        ? problem.attachment_url.map((file, i) => (
            <a
              key={i}
              href={`http://localhost:5000/uploads/${file}`}
              download
              className="inline-flex items-center text-sm font-medium text-black hover:text-green-800 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              📎 Attachment {i + 1}
            </a>
          ))
        : problem.attachment_url && (
            <a
              href={`http://localhost:5000/uploads/${problem.attachment_url}`}
              download
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              📎 Attachment
            </a>
          )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1 font-semibold text-green-700">
          {/* <DollarSign className="h-4 w-4 text-green-500" /> */}
          <span>${problem.budget}</span>
        </div>
        <div className="flex items-center space-x-1 font-semibold text-black">
          <Calendar className="h-4 w-4 text-black" />
          <span>{new Date(problem.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);


}
