import { useEffect, useRef, useState } from "preact/hooks";
import Lng from "./Lng.tsx";

interface FlyoutMenuProps {
  path: string;
}

export default function FlyoutMenu({ path }: FlyoutMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle hover behavior
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500) as unknown as number; // Delay before closing
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className="text-foreground hover:text-foreground grow pl-4 flex items-center"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="underline mr-1 text-sm">
          <Lng
            en="Menu"
            pt="Menu"
          />
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border z-10"
        >
          <div className="rounded-md ring-1 ring-black ring-opacity-5 py-1">
            <a
              href="/products/list-products"
              className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5"
            >
              <Lng
                en="Products"
                pt="Produtos"
              />
            </a>
            <a
              href="/production-plans/list-plans"
              className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/5"
            >
              <Lng
                en="Production Plans"
                pt="Planos de Produção"
              />
            </a>
            <a
              href="/production-reports"
              className={`block px-4 py-2 text-sm ${
                path.startsWith("/production-reports")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-foreground/5"
              }`}
            >
              <Lng
                en="Production Reports"
                pt="Relatórios de Produção"
              />
            </a>
            <a
              href="/ingredient-consumption"
              className={`block px-4 py-2 text-sm ${
                path.startsWith("/ingredient-consumption")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-foreground/5"
              }`}
            >
              <Lng
                en="Ingredient Consumption"
                pt="Consumo de Ingredientes"
              />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
