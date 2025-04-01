import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";
import type { LinksFunction } from "@remix-run/node";

import Footer from "~/components/footer"; // Import Footer


// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Import styling for DataTables globaly
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

export const links: LinksFunction = () => [
  // Haven't found a usecase for this just yet
  // but keeping it just incase I find one and to keep remix happy!
];

export function Layout({ children }: { children: React.ReactNode }) {
// Ensure Bootstrap JS loads only in the browser
// Import Bootstrap JavaScript bundle manually since we're serving our own files 
// instead of using a CDN. This ensures all Bootstrap components (e.g., dropdowns, modals) work.
// We're using a dynamic import to avoid TypeScript errors related to missing type definitions.
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links /> {/* Remix will inject styles from `links()` here */}
      </head>
      <body className="bg-dark text-white d-flex flex-column min-vh-100">

        {/* Page Content */}
        <main className="flex-grow-1">
          {children}
        </main>

        <Footer />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
