import LanguageSelect from "../islands/LanguageSelect.tsx";
import RecipeSelect from "../islands/RecipeSelect.tsx";
import ToggleLightDark from "../islands/ToggleLightDark.tsx";
import PageTransitionLoader from "../islands/PageTransitionLoader.tsx";
import FlyoutMenu from "../islands/FlyoutMenu.tsx";
import { getCookies } from "jsr:@std/http@1.1.3/cookie";
import { defineLayout } from "$fresh/server.ts";

export default defineLayout((req, ctx) => {
  // get cookie
  const cookies = getCookies(req.headers);
  const modeFromCookie = cookies["mode"] || "light";
  let modeFromQuery = null;

  // check for mode query param
  const url = new URL(req.url);
  const modeParam = url.searchParams.get("mode");
  if (modeParam) {
    modeFromQuery = modeParam;
  }

  const path = url.pathname;

  return (
    <div className="site-shell min-h-screen bg-background text-foreground">
      <PageTransitionLoader />
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="nav-inner">
          <a href="/" className="brand" aria-label="BOM Recipe Calculator home">
            <span className="brand-mark" aria-hidden="true">B</span>
            <span className="brand-name">
              bom<span className="brand-divider">/</span>recipe
            </span>
          </a>

          <div className="nav-main">
            <FlyoutMenu path={path} />
            <RecipeSelect />
          </div>

          <div className="nav-tools">
            <LanguageSelect />
            <ToggleLightDark
              modeFromQuery={modeFromQuery}
              modeFromCookie={modeFromCookie}
            />
            <a
              href="https://github.com/saitodisse/bom-recipe-calculator"
              className="nav-github"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </nav>
      <main className="page-main">
        <ctx.Component />
      </main>
    </div>
  );
});
