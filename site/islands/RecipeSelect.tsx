import { JSX } from "preact";

export default function RecipeSelect() {
  const handleChange = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    const value = (e.target as HTMLSelectElement).value;
    console.log(value);
    if (value) {
      window.location.href = `/products/load-example/${value}`;
    }
  };

  return (
    <div class="flex items-center">
      <label htmlFor="recipe-select" class="mr-2 text-gray-600 text-sm">
        Load example:
      </label>
      <select
        id="recipe-select"
        class="border border-gray-300 rounded py-1 px-2 text-sm"
        onChange={handleChange}
      >
        <option value="">Select a recipe</option>
        <option value="american-pancakes">American Pancakes</option>
        <option value="brigadeiro">Brigadeiro</option>
        <option value="brownies">Brownies</option>
        <option value="chese-burguer">Chese Burguer</option>
        <option value="coxinha">Coxinha</option>
        <option value="mac-and-cheese">Mac and Cheese</option>
        <option value="pao-de-queijo">Pão de Queijo</option>
        <option value="pastel-de-queijo">Pastel de Queijo</option>
      </select>
    </div>
  );
}
