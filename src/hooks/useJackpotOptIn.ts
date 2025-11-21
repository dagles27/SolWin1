// src/hooks/useJackpotOptIn.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "solwin_jackpot_opt_in";
const DEFAULT = false;

export default function useJackpotOptIn(): [boolean, (v: boolean) => void] {
  const [optIn, setOptInState] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? DEFAULT : raw === "true";
    } catch {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, optIn ? "true" : "false");
    } catch {
      // ignore write errors (e.g. private mode)
    }
  }, [optIn]);

  const setOptIn = (v: boolean) => {
    setOptInState(v);
  };

  return [optIn, setOptIn];
}
