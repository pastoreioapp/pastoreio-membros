"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export function LeaderPageRefresh() {
  const router = useRouter();

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  return null;
}
