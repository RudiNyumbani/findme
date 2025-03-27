import { Link, useLocation } from "@remix-run/react";

export default function Navbar() {
  const location = useLocation(); // Get current path

  return (
    <nav className="navbar navbar-expand-lg p-2 mb-2 bg-white fixed-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand" to="/">FindMe</Link>

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
                <Link prefetch="intent" className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                  Missing Persons
                </Link>
              </li>
              <li className="nav-item">
                <Link prefetch="intent" className={`nav-link ${location.pathname === "/unidentified" ? "active" : ""}`} to="/unidentified">
                  Unidentified Persons
                </Link>
              </li>
              <li className="nav-item">
                <Link prefetch="intent" className={`nav-link ${location.pathname === "/unclaimed" ? "active" : ""}`} to="/unclaimed">
                  Unclaimed Persons
                </Link>
              </li>
            </ul>

            {/* New Report Button */}
            <Link prefetch="intent" className="btn btn-primary me-3" to="/new-report">New Report</Link>

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
                <Link prefetch="intent" className="nav-link" to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link prefetch="intent" className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
