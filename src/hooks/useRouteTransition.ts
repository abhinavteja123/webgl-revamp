import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteTransition = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  return isLoading;
};
