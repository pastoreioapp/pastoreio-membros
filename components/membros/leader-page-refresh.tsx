"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

export function LeaderPageRefresh() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const leaderMembersPath = /^\/lider\/[^/]+$/;

    if (!leaderMembersPath.test(pathname)) {
      return undefined;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, router]);

  return null;
}
