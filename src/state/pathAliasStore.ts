import { useEffect, useState } from "react";
import { fetchPathAliases } from "@/ipc/alias";

export function usePathAliases(appName: string) {
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPathAliases(appName)
      .then(setAliases)
      .finally(() => setLoading(false));
  }, [appName]);

  return { aliases, loading };
}
