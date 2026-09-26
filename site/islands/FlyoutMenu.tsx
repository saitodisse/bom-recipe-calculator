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
      className="menu-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        ref={buttonRef}
        className="nav-menu-button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>
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
          className="menu-popover"
        >
          <div className="menu-popover-inner">
            <a
              href="/products/list-products"
              className="menu-item"
            >
              <Lng
                en="Products"
                pt="Produtos"
              />
            </a>
            <a
              href="/production-plans/list-plans"
              className="menu-item"
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
                  ? "menu-item menu-item-active"
                  : "menu-item"
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
                  ? "menu-item menu-item-active"
                  : "menu-item"
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
