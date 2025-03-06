import {
  Link,
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
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg p-3 mb-2 bg-white fixed-top">
          <div className="container-fluid">
            {/* Brand */}
            <Link className="navbar-brand" to="#">FindMe</Link>

            {/* Offcanvas Toggle Button */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Offcanvas Sidebar */}
            <div
              className="offcanvas offcanvas-end"
              tabIndex={-1}
              data-bs-scroll="true"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">FindMe</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>

              <div className="offcanvas-body">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" to="#">Missing Persons</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#">Unidentified Persons</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#">Unclaimed Persons</Link>
                  </li>
                </ul>

                {/* New Report Button */}
                <Link className="btn btn-primary me-3" to="#">New Report</Link>

                {/* Language Dropdown, Register & Login */}
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Language
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="#">English</Link></li>
                      <li><Link className="dropdown-item" to="#">Swahili</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#">Login</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>


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
