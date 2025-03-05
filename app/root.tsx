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

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/styles/bootstrap.css" },
  { rel: "stylesheet", href: "/styles/global.css" },
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
      <body className="bg-dark text-white">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg p-3 mb-2 bg-white">
          <div className="container-fluid">
            <Link className="navbar-brand" to="#">Navbar</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="#">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="#">Link</Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </Link>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="#">Action</Link></li>
                    <li><Link className="dropdown-item" to="#">Another action</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link disabled" aria-disabled="true" to={"#"}>Disabled</Link>
                </li>
              </ul>
              <form className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container-fluid">
          {children}
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
