import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getStorageItem, setStorageItem } from "../utils/storage.ts";

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
      <label htmlFor="language-select" class="mr-2 text-gray-600 text-sm">
        Language:
      </label>
      <select
        id="language-select"
        class="border border-gray-300 rounded py-1 px-2 text-sm"
        onChange={handleChange}
        value={language}
      >
        <option value="">Select a language</option>
        <option value="en">English</option>
        <option value="pt">Portuguese</option>
      </select>
    </div>
  );
}
