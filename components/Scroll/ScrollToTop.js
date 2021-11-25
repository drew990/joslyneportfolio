import { useEffect, useState } from "react";

import { classNames } from "../../utils/classNames";
import styles from "../../styles/ScrollToTop.module.css";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-2 right-2">
      <button
        type="button"
        onClick={scrollToTop}
        className={classNames(isVisible ? styles.Show : "opacity-0")}
      >
        <h3 style={{ marginBottom: 0 }}>^</h3>
      </button>
    </div>
  );
};
