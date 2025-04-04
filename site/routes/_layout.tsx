import LanguageSelect from "../islands/LanguageSelect.tsx";
import RecipeSelect from "../islands/RecipeSelect.tsx";
import Lng from "../islands/Lng.tsx";
import ToggleLightDark from "../islands/ToggleLightDark.tsx";
import PageTransitionLoader from "../islands/PageTransitionLoader.tsx";
import FlyoutMenu from "../islands/FlyoutMenu.tsx";
import { getCookies } from "jsr:@std/http/cookie";
import { defineLayout } from "$fresh/server.ts";

export default defineLayout(async (req, ctx) => {
  // get cookie
  const cookies = getCookies(req.headers);
  let modeFromCookie = cookies["mode"] || "light";
  let modeFromQuery = null;

  // check for mode query param
  const url = new URL(req.url);
  const modeParam = url.searchParams.get("mode");
  if (modeParam) {
    modeFromQuery = modeParam;
  }

  const path = url.pathname;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageTransitionLoader />
      <nav className="shadow-md w-full">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-between w-full">
            <div className="flex items-center space-x-4 w-full">
              <a href="/" className="text-xl font-medium text-foreground">
                bom-recipe-calculator
              </a>

              {/* Interactive Flyout Menu */}
              <FlyoutMenu path={path} />

              <RecipeSelect />
            </div>
            <LanguageSelect />

            <ToggleLightDark
              modeFromQuery={modeFromQuery}
              modeFromCookie={modeFromCookie}
            />

            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/saitodisse/bom-recipe-calculator"
                className="text-foreground hover:text-foreground"
              >
                Github
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto max-w-5xl px-4 pt-4">
        <ctx.Component />
      </main>
    </div>
  );
});
