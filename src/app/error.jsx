"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem", color: "red" }}>
      <h2>❌ Ooops!! Something went wrong.</h2>
      <p>{error?.message || "An unexpected error occurred."}</p>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1rem",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔄 Try Again
        </button>

        <button
          onClick={() => router.back()}
          style={{
            padding: "0.5rem 1rem",
            background: "gray",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔙 Go Back
        </button>

        <button
          onClick={() => router.push("/")}
          style={{
            padding: "0.5rem 1rem",
            background: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          🏠 Go to Home
        </button>
      </div>
    </div>
  );
}
