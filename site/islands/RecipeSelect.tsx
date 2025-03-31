import { JSX } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { getStorageItem, setStorageItem } from "../utils/storage.ts";
import Lng from "./Lng.tsx";

export default function RecipeSelect() {
  // Initialize with default values
  const [language, setLanguage] = useState("en");
  const [recipeSelected, setRecipeSelected] = useState("");

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return;
    }

    // get current language
    const storedLanguage = getStorageItem("language", "en");
    const storedRecipe = getStorageItem("recipeSelected", "");
    setLanguage(storedLanguage);
    setRecipeSelected(storedRecipe);
  }, []);

  const handleChange = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    const value = (e.target as HTMLSelectElement).value;

    // save on localStorage - only in browser environment
    setStorageItem("recipeSelected", value);
    setRecipeSelected(value);

    if (value) {
      window.location.href = `/products/load-example/${value}`;
    }
  };

  const getRecipeName = useCallback((name: string) => {
    if (name === "american-pancakes") {
      return language === "pt" ? "Pancakes americanos" : "American Pancakes";
    }
    if (name === "brigadeiro") {
      return language === "pt" ? "Brigadeiro" : "Brigadeiro";
    }
    if (name === "brownies") {
      return language === "pt" ? "Brownies" : "Brownies";
    }
    if (name === "chese-burguer") {
      return language === "pt" ? "Chese Burguer" : "Chese Burguer";
    }
    if (name === "coxinha") {
      return language === "pt" ? "Coxinha" : "Coxinha";
    }
    if (name === "mac-and-cheese") {
      return language === "pt" ? "Mac and Cheese" : "Mac and Cheese";
    }
    if (name === "pao-de-queijo") {
      return language === "pt" ? "Pão de Queijo" : "Pão de Queijo";
    }
    if (name === "pastel-de-queijo") {
      return language === "pt" ? "Pastel de Queijo" : "Pastel de Queijo";
    }
    return name;
  }, [language]);

  return (
    <div class="flex items-baseline">
      <div class="flex items-center mx-2 text-sm text-foreground/70">
        <Lng
          en="Select an example:"
          pt="Selecione um exemplo:"
        />
      </div>
      <select
        id="recipe-select"
        class="border border-border rounded py-1 px-2 text-sm bg-background text-foreground w-36"
        onChange={handleChange}
        value={recipeSelected}
      >
        <option value="">
          <Lng
            en="Select an example"
            pt="Selecione um exemplo"
          />
        </option>
        <option value="american-pancakes">
          {getRecipeName("american-pancakes")}
        </option>
        <option value="brigadeiro">
          {getRecipeName("brigadeiro")}
        </option>
        <option value="brownies">
          {getRecipeName("brownies")}
        </option>
        <option value="chese-burguer">
          {getRecipeName("chese-burguer")}
        </option>
        <option value="coxinha">
          {getRecipeName("coxinha")}
        </option>
        <option value="mac-and-cheese">
          {getRecipeName("mac-and-cheese")}
        </option>
        <option value="pao-de-queijo">
          {getRecipeName("pao-de-queijo")}
        </option>
        <option value="pastel-de-queijo">
          {getRecipeName("pastel-de-queijo")}
        </option>
      </select>
    </div>
  );
}
