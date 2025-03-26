import { JSX } from "preact";

export default function LanguageSelect() {
  const handleChange = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    const value = (e.target as HTMLSelectElement).value;

    if (value) {
      // save value on localStorage
      localStorage.setItem("language", value);
      window.location.reload();
    }
  };

  const language = localStorage.getItem("language");

  return (
    <div class="flex items-center">
      <label htmlFor="language-select" class="mr-2 text-gray-600 text-sm">
        Language:
      </label>
      <select
        id="language-select"
        class="border border-gray-300 rounded py-1 px-2 text-sm"
        onChange={handleChange}
        value={language || ""}
      >
        <option value="">Select a language</option>
        <option value="en">English</option>
        <option value="pt">Portuguese</option>
      </select>
    </div>
  );
}
