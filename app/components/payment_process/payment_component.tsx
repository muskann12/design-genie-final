'use client'
import { OrderDataType } from '@/helper/componentTypes';
import React, { useEffect, useState } from 'react';
import { PaymentOptions } from './handlePayment';
import { motion } from "framer-motion";

export const Payment_Component = () => {
  const [orderData, setOrderData] = useState<OrderDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('currentOrder');
      if (data) {
        try {
          setOrderData(JSON.parse(data));
        } catch (error) {
          console.error("Error parsing order data:", error);
        }
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className='min-h-screen bg-gradient-to-b from-gray-100 to-white text-blue-950 font-extrabold text-3xl flex justify-center items-center font-sans'>Loading order data...</div>;
  }

  if (!orderData) {
    return <div className='min-h-screen bg-gradient-to-b from-gray-100 to-white text-blue-950 font-extrabold text-3xl flex justify-center items-center font-sans'>No order data found</div>;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-100 to-white">
    {/* Header Section with enhanced styling */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-950 to-gray-800">
        Payment Confirmation
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="max-w-2xl mx-auto text-gray-500 text-lg"
      >
         While you wait, feel free to explore more of our premium collection for style and comfort. We’re here to make sure you look and feel your best!
      </motion.p>
    </motion.div>
    <PaymentOptions orderData={orderData}/>
    </div>
  );
};
