import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getStorageItem, setStorageItem } from "../utils/storage.ts";
import Lng from "./Lng.tsx";

export default function LanguageSelect() {
  const [language, setLanguage] = useState("");

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    const storedLanguage = getStorageItem("language", "");
    setLanguage(storedLanguage);
  }, []);

  const handleChange = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    const value = (e.target as HTMLSelectElement).value;

    if (value) {
      // save value on localStorage
      setStorageItem("language", value);
      window.location.reload();
    }
  };

  return (
    <div class="flex items-center">
      <label htmlFor="language-select" class="mr-2 text-foreground text-sm">
        <Lng
          en="Lang:"
          pt="Idioma:"
        />
      </label>
      <select
        id="language-select"
        class="border border-border rounded py-1 px-2 text-sm bg-background text-foreground w-16"
        onChange={handleChange}
        value={language}
      >
        <option value="en">en</option>
        <option value="pt">pt</option>
      </select>
    </div>
  );
}
