import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import GlobalLoading from "../component/Loading/GlobalLoading";

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
  }
  return context;
};

interface GlobalLoadingProviderProps {
  children: ReactNode;
  enablePageTransition?: boolean;
  pageTransitionDelay?: number;
}

export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({
  children,
  enablePageTransition = true,
  pageTransitionDelay = 300,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Đang tải...");
  const [, setLoadingCount] = useState(0);
  
  const location = useLocation();

  // Auto loading khi chuyển trang
  useEffect(() => {
    if (!enablePageTransition) return;

    setMessage("Đang tải...");
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, pageTransitionDelay);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [location.pathname, enablePageTransition, pageTransitionDelay]);

  const showLoading = (msg = "Đang tải...") => {
    setMessage(msg);
    setLoadingCount((prev) => prev + 1);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setLoadingCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <GlobalLoading isLoading={isLoading} message={message} />
    </LoadingContext.Provider>
  );
};