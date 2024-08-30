import React, { createContext, useState, useContext } from 'react';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState(null);

  return (
    <PaymentContext.Provider value={{ paymentData, setPaymentData }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => useContext(PaymentContext);