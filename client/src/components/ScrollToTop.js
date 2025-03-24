import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Get current route

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll page to top on route change
  }, [pathname]); // Runs on every route change

  return null; // This component does not render anything
};

export default ScrollToTop;
