// src/hooks/useMembership.ts

import { useState, useEffect, useCallback } from 'react';
import {
  getMembershipPlans,
  createPaymentUrl,
  getUserSubscription,
  getSubscriptionById,
  cancelSubscription,
  toggleAutoRenew,
  getSubscriptionPaymentHistory,
  type MembershipPlan,
  type SubscriptionDTO,
  type CreateSubscriptionPaymentDTO,
  type PaymentUrlResponse
} from '../apis/membership/membershipApi';

interface UseMembershipReturn {
  // State
  plans: MembershipPlan[];
  currentSubscription: SubscriptionDTO | null;
  paymentHistory: any[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadPlans: () => Promise<void>;
  loadUserSubscription: () => Promise<void>;
  loadPaymentHistory: () => Promise<void>;
  createPayment: (paymentData: CreateSubscriptionPaymentDTO) => Promise<PaymentUrlResponse>;
  cancelUserSubscription: (subscriptionId: string) => Promise<void>;
  updateAutoRenew: (subscriptionId: string, autoRenew: boolean) => Promise<void>;
  clearError: () => void;
  refreshSubscription: () => Promise<void>;
}

export const useMembership = (): UseMembershipReturn => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionDTO | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load membership plans
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const plansData = await getMembershipPlans();
      setPlans(plansData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading plans:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user's current subscription
  const loadUserSubscription = useCallback(async () => {
    try {
      setError(null);
      const subscription = await getUserSubscription();
      setCurrentSubscription(subscription);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading subscription:', err);
    }
  }, []);

  // Load payment history
  const loadPaymentHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await getSubscriptionPaymentHistory();
      setPaymentHistory(history);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading payment history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create payment URL
  const createPayment = useCallback(async (paymentData: CreateSubscriptionPaymentDTO): Promise<PaymentUrlResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await createPaymentUrl(paymentData);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel subscription
  const cancelUserSubscription = useCallback(async (subscriptionId: string) => {
    try {
      setLoading(true);
      setError(null);
      await cancelSubscription(subscriptionId);
      
      // Refresh subscription data
      await loadUserSubscription();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUserSubscription]);

  // Update auto renew setting
  const updateAutoRenew = useCallback(async (subscriptionId: string, autoRenew: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await toggleAutoRenew(subscriptionId, autoRenew);
      
      // Update local state
      if (currentSubscription && currentSubscription.subscriptionId === subscriptionId) {
        setCurrentSubscription({
          ...currentSubscription,
          autoRenew
        });
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentSubscription]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh subscription data
  const refreshSubscription = useCallback(async () => {
    await loadUserSubscription();
  }, [loadUserSubscription]);

  // Load initial data on mount
  useEffect(() => {
    loadPlans();
    loadUserSubscription();
  }, [loadPlans, loadUserSubscription]);

  return {
    // State
    plans,
    currentSubscription,
    paymentHistory,
    loading,
    error,
    
    // Actions
    loadPlans,
    loadUserSubscription,
    loadPaymentHistory,
    createPayment,
    cancelUserSubscription,
    updateAutoRenew,
    clearError,
    refreshSubscription
  };
};

// Hook for subscription details page
export const useSubscriptionDetails = (subscriptionId?: string) => {
  const [subscription, setSubscription] = useState<SubscriptionDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubscriptionById(id);
      setSubscription(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading subscription details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subscriptionId) {
      loadSubscription(subscriptionId);
    }
  }, [subscriptionId, loadSubscription]);

  return {
    subscription,
    loading,
    error,
    loadSubscription,
    clearError: () => setError(null)
  };
};

// Hook for payment status checking
export const usePaymentStatus = () => {
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [subscription, setSubscription] = useState<SubscriptionDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPaymentStatus = useCallback(async (transactionRef: string) => {
    try {
      setStatus('checking');
      setError(null);
      
      // Import payment status function
      const { getPaymentStatus } = await import('../apis/membership/membershipApi');
      const result = await getPaymentStatus(transactionRef);
      
      switch (result.status) {
        case 'Completed':
          setStatus('success');
          setSubscription(result.subscription || null);
          break;
        case 'Failed':
          setStatus('failed');
          setError(result.message || 'Thanh toán thất bại');
          break;
        case 'Pending':
          setStatus('pending');
          break;
        default:
          setStatus('failed');
          setError('Trạng thái thanh toán không xác định');
      }
    } catch (err: any) {
      setStatus('failed');
      setError(err.message);
      console.error('Error checking payment status:', err);
    }
  }, []);

  return {
    status,
    subscription,
    error,
    checkPaymentStatus,
    clearError: () => setError(null)
  };
};

export default useMembership;