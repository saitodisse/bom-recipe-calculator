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
      globalThis.location.reload();
    }
  };

  return (
    <div class="language-picker">
      <select
        id="language-select"
        aria-label="Language"
        class="nav-select language-select"
        onChange={handleChange}
        value={language}
      >
        <option value="en">en</option>
        <option value="pt">pt</option>
      </select>
    </div>
  );
}
