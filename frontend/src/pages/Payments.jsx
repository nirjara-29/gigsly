import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { api } from '../lib/api';
import { DollarSign, Lock, CheckCircle, Clock } from 'lucide-react';

export function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await api.getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = async (paymentId) => {
    try {
      await api.releasePayment(paymentId);
      await loadPayments(); // Refresh the list
      alert('Payment released successfully!');
    } catch (error) {
      alert('Error releasing payment. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'escrowed': return <Lock className="h-5 w-5 text-yellow-600" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'escrowed': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalEarnings = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const escrowedAmount = payments.filter(p => p.status === 'escrowed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-2">Manage your earnings and escrow payments</p>
          </div>

          {/* Payment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">${totalEarnings}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">In Escrow</p>
                    <p className="text-2xl font-bold text-yellow-600">${escrowedAmount}</p>
                  </div>
                  <Lock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            
            {payments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                  <p className="text-gray-500">Complete projects to start earning</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {payments.map((payment) => (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(payment.status)}
                          <div>
                            <h3 className="font-semibold text-gray-900">{payment.problemTitle}</h3>
                            <p className="text-sm text-gray-500">
                              {payment.status === 'completed' && payment.releaseDate
                                ? `Released on ${new Date(payment.releaseDate).toLocaleDateString()}`
                                : 'Held in escrow until project completion'
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${payment.amount}</p>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                          
                          {payment.status === 'escrowed' && (
                            <Button 
                              onClick={() => handleReleasePayment(payment.id)}
                              size="sm"
                            >
                              Release Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}