import { useState, useEffect, useMemo } from 'react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 767);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }, []);
  
    return useMemo(() => isMobile, [isMobile]);
  };
  
export default useIsMobile;