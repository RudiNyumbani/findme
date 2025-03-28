import { Link } from "@remix-run/react";
import { useState } from "react";

// Mock Data (Replace with API Calls Later)
const user = { name: "John Doe", lastLogin: "2025-03-20 14:32" };
const userReports = [
  { caseNumber: "MSP-2025-00A5", status: "Active", date: "2025-03-12" },
  { caseNumber: "UNC-2025-00C7", status: "Closed", date: "2025-02-28" },
];

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div  className={`container py-5 mt-5 ${darkMode ? "bg-dark text-light" : ""}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">👋 Welcome, {user.name}!</h2>
        <div>
          <span className="me-3 text-muted">Last login: {user.lastLogin}</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-outline-secondary"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search Case Number or Name..."
        />
      </div>

      {/* Stats Section */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">📋 Your Reports</h5>
              <p className="display-6 fw-bold">{userReports.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">✔️ Cases Resolved</h5>
              <p className="display-6 fw-bold">4</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">📢 Active Reports</h5>
              <p className="display-6 fw-bold">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h4 className="mt-5 fw-bold">📌 Quick Actions</h4>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <Link to="/report" className="btn btn-lg btn-primary w-100">
          📋 Submit a New Report
        </Link>
        <Link to="/track" className="btn btn-lg btn-secondary w-100">
          🔎 Search & Track
        </Link>
        <Link to="/profile" className="btn btn-lg btn-outline-dark w-100">
          👤 View Profile
        </Link>
      </div>

      {/* User Reports Section */}
      <h4 className="mt-5 fw-bold">📝 Your Reports</h4>
      <div className="list-group">
        {userReports.length > 0 ? (
          userReports.map((report) => (
            <Link
              key={report.caseNumber}
              to={`/cases/${report.caseNumber}`}
              className="list-group-item list-group-item-action d-flex justify-content-between"
            >
              <span>{report.caseNumber} - {report.status}</span>
              <span className="badge bg-secondary">{report.date}</span>
            </Link>
          ))
        ) : (
          <p className="text-muted">No reports submitted yet.</p>
        )}
      </div>
    </div>
  );
}
