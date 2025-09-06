import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Calendar, DollarSign } from 'lucide-react';

export function ProblemCard({ problem }) {
  const navigate=useNavigate();
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
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md"
       onClick={handleClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {problem.title}
          </CardTitle>
          <Badge className={getStatusColor(problem.status)}>
            {formatStatus(problem.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-3">{problem.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">${problem.budget}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(problem.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      
     
    </Card>
  );
}