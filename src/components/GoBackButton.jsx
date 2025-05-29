"use client";

import { useRouter } from "next/navigation";
function GoBackButton({
  optionalRoute = "/",
  children,
  className = "go-back-button",
}) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(optionalRoute);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children || "Go Back"}
    </button>
  );
}

export default GoBackButton;
