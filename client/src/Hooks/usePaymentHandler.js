import { useState, useCallback } from 'react';
import { usePayment } from '../context/PaymentContext';

export const usePaymentHandler = () => {
  const { processPayment, validateCoupon, calculateInstallments } = usePayment();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discount, setDiscount] = useState(0);

  const handleCouponValidation = useCallback(async (couponCode) => {
    if (!couponCode) {
      setDiscount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await validateCoupon(couponCode);
      
      if (result.valid) {
        setDiscount(result.discount);
        return result.discount;
      } else {
        setError('Invalid coupon code');
        setDiscount(0);
      }
    } catch (err) {
      setError('Error validating coupon');
      setDiscount(0);
    } finally {
      setLoading(false);
    }
  }, [validateCoupon]);

  const handlePayment = useCallback(async ({
    amount,
    type,
    programId,
    couponCode,
    installments,
    paymentMethodId
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Calculate final amount after discount
      const finalAmount = amount - discount;

      // Process the payment
      const result = await processPayment({
        amount: finalAmount,
        type,
        programId,
        couponCode,
        installments,
        paymentMethodId
      });

      return result;
    } catch (err) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [processPayment, discount]);

  const calculatePaymentPlan = useCallback((amount, installments) => {
    // Apply discount to original amount
    const discountedAmount = amount - discount;
    return calculateInstallments(discountedAmount, installments);
  }, [calculateInstallments, discount]);

  return {
    loading,
    error,
    discount,
    handleCouponValidation,
    handlePayment,
    calculatePaymentPlan,
    clearError: () => setError(null)
  };
};
