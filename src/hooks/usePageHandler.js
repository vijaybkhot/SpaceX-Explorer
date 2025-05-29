import { useEffect } from "react";
import { useRouter } from "next/router";

export default function usePageHandler({
  data,
  loading,
  error,
  checkEmptyDocs = true,
}) {
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      !error &&
      data &&
      checkEmptyDocs &&
      data.docs?.length === 0
    ) {
      router.replace("/404");
    }
  }, [loading, error, data, checkEmptyDocs, router]);

  if (loading) {
    return {
      status: "loading",
      component: <div className="loading-msg">Loading...</div>,
    };
  }

  if (error) {
    return {
      status: "error",
      component: <div className="error-msg">Error: {error}</div>,
    };
  }

  return {
    status: "ok",
    component: null,
  };
}
