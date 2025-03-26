import { useEffect, useState } from "preact/hooks";
import { getStorageItem } from "../utils/storage.ts";

interface LngProps {
  en: string;
  pt: string;
}

export default function Lng({
  en,
  pt,
}: LngProps) {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (!language) {
      const lang = getStorageItem("language", "en");
      setLanguage(lang);
    }
  }, [language]);

  return <>{language === "en" ? en : pt}</>;
}
