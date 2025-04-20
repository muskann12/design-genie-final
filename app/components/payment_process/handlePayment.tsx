'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { OrderDataType } from '@/helper/componentTypes';

export const PaymentOptions = ({ orderData }: { orderData: OrderDataType }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const router = useRouter();

  const handlePayment = () => {
    // Payment handling logic here
    toast.success('Payment successful!');
    router.push('/order-confirmation');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Order Summary</h3>
      <div className="border-t border-gray-200 pt-4">
        {/* Order details */}
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Subtotal</span>
          <span>${orderData.totalAmount}</span>
        </div>
      </div>
      
      {/* Payment methods */}
      <div className="space-y-3 mt-6">
        <h3 className="font-medium text-gray-900">Payment Method</h3>
        {/* Add your payment method options here */}
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Complete Payment
      </button>
    </div>
  );
};
