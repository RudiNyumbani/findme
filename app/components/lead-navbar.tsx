import { Link } from "@remix-run/react";

export default function AgentNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/lead">
          👮 Agent Panel
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agentNavbar"
          aria-controls="agentNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="agentNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/lead">
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/lead/all-cases">
                📚 All Cases
              </Link>
            </li>
            {/*
            <li className="nav-item">
              <Link className="nav-link" to="/lead/profile">
                👤 Profile
              </Link>
            </li>
            */}
          </ul>
          <form method="post" action="/logout">
            <button className="btn btn-outline-light" type="submit">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
