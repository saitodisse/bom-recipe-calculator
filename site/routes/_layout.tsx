import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component, state }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md fixed top-0 w-full z-10">
        <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-xl font-medium text-gray-800">
              BOM recipe calculator
            </a>
            <a
              href="/products/list-products"
              className="text-gray-600 hover:text-gray-800"
            >
              Products
            </a>
            <a href="/doc" className="text-gray-600 hover:text-gray-800">
              Documentation
            </a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto max-w-5xl px-4 pt-20">
        <Component />
      </main>
    </div>
  );
}
