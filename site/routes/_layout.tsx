import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component, state }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-between w-full">
            <div className="flex items-center space-x-4 w-full">
              <a href="/" className="text-xl font-medium text-gray-800">
                BOM recipe calculator
              </a>
              <a
                href="/products/list-products"
                className="text-gray-600 hover:text-gray-800 grow"
              >
                Products
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/saitodisse/bom-recipe-calculator"
                className="text-gray-600 hover:text-gray-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto max-w-5xl px-4 pt-20">
        <Component />
      </main>
    </div>
  );
}
