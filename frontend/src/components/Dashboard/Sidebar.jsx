import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  MessageSquare,
  Shield
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'My Problems',
    href: '/dashboard/problems',
    icon: FileText
  },
  {
    title: 'My Solutions',
    href: '/dashboard/solutions',
    icon: CheckCircle
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: DollarSign
  },
  {
    title: 'Messages',
    href: '/chat',
    icon: MessageSquare
  }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                )}
              >
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}