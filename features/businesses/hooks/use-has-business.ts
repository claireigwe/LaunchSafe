import { useState, useEffect } from "react";
import { fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";

const ALL_BIZ_KEY = "launchsafe-all-businesses";

function hasLocalBusinesses(): boolean {
  try {
    const raw = localStorage.getItem(ALL_BIZ_KEY);
    if (!raw) return false;
    const list = JSON.parse(raw);
    return list.length > 0;
  } catch { return false; }
}

export function useHasBusiness() {
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(() => {
    const local = hasLocalBusinesses();
    return local ? true : null;
  });
  
  useEffect(() => {
    async function check() {
      const list = await fetchAllBusinesses();
      setHasBusiness(list.length > 0);
    }
    check();
  }, []);

  return hasBusiness;
}
