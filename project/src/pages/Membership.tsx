// src/pages/MembershipPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  CreditCard,
  Loader2,
  ChevronDown,
  QrCode,
  Smartphone
} from 'lucide-react';
import VietQRPayment from '../components/VietQRPayment';

interface MembershipPlan {
  planId: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isActive: boolean;
  recommended?: boolean;
}

const MembershipPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [paymentMethod, setPaymentMethod] = useState<'VietQR' | 'VNPay' | 'MoMo'>('VietQR');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  // Load membership plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('/api/subscription/plans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.isSuccess) {
          setPlans(result.result);
          // Set default to recommended plan
          const recommendedPlan = result.result.find((p: MembershipPlan) => p.recommended);
          if (recommendedPlan) {
            setSelectedPlan(recommendedPlan.planId);
          }
        }
      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Check existing subscription
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/subscription/user-subscription', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if (result.isSuccess && result.result) {
          setCurrentSubscription(result.result);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, []);

  const handleCreatePayment = () => {
    if (!selectedPlan) {
      alert('Vui lòng chọn gói membership');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để tiếp tục');
      window.location.href = '/login';
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentCreated = (paymentData: any) => {
    console.log('Payment created:', paymentData);
    // Payment component handles the flow
  };

  const getSelectedPlan = () => {
    return plans.find(p => p.planId === selectedPlan);
  };

  const getPrice = (plan: MembershipPlan) => {
    return billingCycle === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: MembershipPlan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlySavings = monthlyTotal - plan.yearlyPrice;
    return yearlySavings;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If user already has subscription
  if (currentSubscription && currentSubscription.status === 'Active') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              You're Already a Member!
            </h1>
            <p className="text-gray-600 mb-4">
              You have an active {currentSubscription.planName} subscription
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-green-800">
                <p><strong>Plan:</strong> {currentSubscription.planName}</p>
                <p><strong>Billing:</strong> {currentSubscription.billingCycle}</p>
                <p><strong>Valid until:</strong> {new Date(currentSubscription.endDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show payment component
  if (showPayment && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setShowPayment(false)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Back to Plans
            </button>
          </div>
          <VietQRPayment
            planId={selectedPlan}
            billingCycle={billingCycle}
            onPaymentCreated={handlePaymentCreated}
            onClose={() => setShowPayment(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Membership Plan
          </h1>
          <p className="text-lg text-gray-600">
            Get access to professional healthcare consultations and premium features
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-sm border">
            <button
              onClick={() => setBillingCycle('Monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'Monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('Yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'Yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.planId}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
                selectedPlan === plan.planId
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              } ${plan.recommended ? 'relative' : ''}`}
              onClick={() => setSelectedPlan(plan.planId)}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {getPrice(plan).toLocaleString('vi-VN')}
                    </span>
                    <span className="text-gray-500 ml-1">VND</span>
                    <span className="text-gray-400 ml-2">
                      /{billingCycle === 'Monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'Yearly' && getSavings(plan) > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Save {getSavings(plan).toLocaleString('vi-VN')} VND per year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={`w-full py-2 px-4 rounded-lg border-2 transition-colors ${
                  selectedPlan === plan.planId
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-400'
                }`}>
                  <div className="text-center text-sm font-medium">
                    {selectedPlan === plan.planId ? 'Selected' : 'Select Plan'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method Selection */}
        {selectedPlan && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Choose Payment Method
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* VietQR */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'VietQR'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setPaymentMethod('VietQR')}
              >
                <div className="flex items-center mb-2">
                  <QrCode className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">VietQR</span>
                  <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Scan QR code with your banking app
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Smartphone className="w-3 h-3 mr-1" />
                  Fast & Secure
                </div>
              </div>

              {/* VNPay */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all opacity-50 ${
                  paymentMethod === 'VNPay'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                // onClick={() => setPaymentMethod('VNPay')} // Disabled for now
              >
                <div className="flex items-center mb-2">
                  <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">VNPay</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Pay with credit/debit card
                </p>
              </div>

              {/* MoMo */}
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all opacity-50 ${
                  paymentMethod === 'MoMo'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                // onClick={() => setPaymentMethod('MoMo')} // Disabled for now
              >
                <div className="flex items-center mb-2">
                  <Smartphone className="w-6 h-6 text-pink-600 mr-2" />
                  <span className="font-medium text-gray-900">MoMo</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Pay with MoMo e-wallet
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary & Checkout */}
        {selectedPlan && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{getSelectedPlan()?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Cycle:</span>
                <span className="font-medium">{billingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{paymentMethod}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {getSelectedPlan() ? getPrice(getSelectedPlan()!).toLocaleString('vi-VN') : '0'} VND
                  </span>
                </div>
                {billingCycle === 'Yearly' && getSelectedPlan() && getSavings(getSelectedPlan()!) > 0 && (
                  <p className="text-sm text-green-600 text-right mt-1">
                    You save {getSavings(getSelectedPlan()!).toLocaleString('vi-VN')} VND
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCreatePayment}
              disabled={!selectedPlan || paymentMethod !== 'VietQR'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {paymentMethod === 'VietQR' ? (
                <>
                  <QrCode className="w-5 h-5 mr-2" />
                  Create VietQR Payment
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Payment
                </>
              )}
            </button>

            {paymentMethod !== 'VietQR' && (
              <p className="text-sm text-gray-500 text-center mt-2">
                This payment method is not available yet. Please use VietQR.
              </p>
            )}

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>🔒 Secure payment processing</p>
              <p>💳 No hidden fees or charges</p>
              <p>📞 24/7 customer support available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;