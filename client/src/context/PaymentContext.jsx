import React, { createContext, useContext, useState, useCallback } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentState, setPaymentState] = useState({
    loading: false,
    error: null,
    currentPayment: null,
    lastPayment: null,
  });

  const validateCoupon = useCallback(async (couponCode) => {
    try {
      const response = await fetch(`/api/payments/validate-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw error;
    }
  }, []);

  const calculateInstallments = useCallback((amount, installments) => {
    const monthlyAmount = Math.ceil(amount / installments);
    const lastInstallment = amount - (monthlyAmount * (installments - 1));
    
    return {
      monthlyAmount,
      lastInstallment,
      totalAmount: amount,
      numberOfInstallments: installments,
    };
  }, []);

  const processPayment = useCallback(async ({
    amount,
    type,
    programId,
    couponCode,
    installments,
    paymentMethodId
  }) => {
    setPaymentState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/payments/${type}-enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          programId,
          couponCode,
          installments,
          paymentMethodId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      setPaymentState(prev => ({
        ...prev,
        loading: false,
        lastPayment: data,
        currentPayment: null,
      }));

      return data;
    } catch (error) {
      setPaymentState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const initiateRefund = useCallback(async (paymentId, amount, reason) => {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          amount,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Refund failed');
      }

      return data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }, []);

  const value = {
    paymentState,
    validateCoupon,
    calculateInstallments,
    processPayment,
    initiateRefund,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;
