import { useState, useEffect } from "react";
import { fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";

export function useHasBusiness() {
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(null);
  
  useEffect(() => {
    async function check() {
      try {
        const list = await fetchAllBusinesses();
        setHasBusiness(list.length > 0);
      } catch {
        setHasBusiness(false);
      }
    }
    check();
  }, []);

  return hasBusiness;
}
