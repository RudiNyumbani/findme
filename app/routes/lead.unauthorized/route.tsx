// app/routes/unauthorized.tsx
import { Link } from "@remix-run/react";

export default function Unauthorized() {
  return (
    <div className="container text-center mt-5 pt-5">
      <h1 className="display-4 text-danger mb-4">🚫 Unauthorized Access</h1>
      <p className="lead">
        You do not have the necessary permissions to view this page.
      </p>
      <p className="mb-4">
        This section is restricted to Law Enforcement Agents only. If you’re a public user, please return to the main dashboard. If you believe this is a mistake, try logging in again.
      </p>

      <div className="d-flex justify-content-center gap-3">
        <Link to="/" className="btn btn-outline-primary">
          🔙 Back to User Dashboard
        </Link>
        <Link to="/lead" className="btn btn-primary">
          🔐 Login Again
        </Link>
      </div>
    </div>
  );
}
