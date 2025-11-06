"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_CURRENCY } from "@/lib/currency";

type CurrencyContextType = {
  selectedCurrency: string;
  updateCurrency: (newCurrency: string) => Promise<void>;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  selectedCurrency: DEFAULT_CURRENCY,
  updateCurrency: async () => { },
  isLoading: false,
});

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    // Try to get from localStorage first, fallback to default
    try {
      return localStorage.getItem("shopsmart-currency") || DEFAULT_CURRENCY;
    } catch {
      return DEFAULT_CURRENCY;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save to localStorage when currency changes
  useEffect(() => {
    try {
      localStorage.setItem("shopsmart-currency", selectedCurrency);
    } catch (error) {
      console.warn("Could not save currency preference:", error);
    }
  }, [selectedCurrency]);

  const updateCurrency = async (newCurrency: string) => {
    setIsLoading(true);
    try {
      // Add any API calls here if needed (e.g., updating user preferences)
      setSelectedCurrency(newCurrency);
    } catch (error) {
      console.error("Failed to update currency:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    selectedCurrency,
    updateCurrency,
    isLoading,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};
