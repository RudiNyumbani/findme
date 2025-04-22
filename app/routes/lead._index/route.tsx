import { useState } from "react";
import { Link } from "@remix-run/react";
import AgentNavbar from "~/components/lead-navbar"; // You can create this component similar to DashNavbar

export default function AgentDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  // Placeholder mock cases
  const handledCases = [
    {
      caseNumber: "MSP-2025-00D4",
      name: "Jane Doe",
      status: "active",
      dateReported: "2025-04-10",
    },
    {
      caseNumber: "UNP-2025-00A1",
      name: "Unknown Male",
      status: "under investigation",
      dateReported: "2025-03-25",
    },
  ];

  return (
    <>
      <AgentNavbar />
      <div className={`container py-5 mt-5 ${darkMode ? "bg-dark text-light" : ""}`}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">🚓 Welcome, Officer</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Stats Section */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">📂 Handled Cases</h5>
                <p className="display-6 fw-bold">{handledCases.length}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <h5 className="card-title">🕵️‍♂️ Under Investigation</h5>
                <p className="display-6 fw-bold">
                  {handledCases.filter((c) => c.status === "under investigation").length}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">✅ Closed Cases</h5>
                <p className="display-6 fw-bold">
                  {handledCases.filter((c) => c.status === "closed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Handled Cases Table */}
        <h4 className="fw-bold mb-3">📋 Your Assigned Cases</h4>
        <div className="table-responsive mb-5">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Case Number</th>
                <th>Name</th>
                <th>Status</th>
                <th>Date Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {handledCases.map((caseData) => (
                <tr key={caseData.caseNumber}>
                  <td>{caseData.caseNumber}</td>
                  <td>{caseData.name}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(caseData.status)}`}>
                      {caseData.status}
                    </span>
                  </td>
                  <td>{caseData.dateReported}</td>
                  <td>
                    <Link
                      to={`/cases/${caseData.caseNumber}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View
                    </Link>
                    <button className="btn btn-sm btn-outline-secondary">
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add more quick actions if needed */}
        <div className="d-flex gap-3 flex-wrap">
          <Link to="/agent/all-cases" className="btn btn-outline-info w-100">
            📚 View All Cases
          </Link>
          <Link to="/agent/profile" className="btn btn-outline-light w-100">
            👤 Agent Profile
          </Link>
        </div>
      </div>
    </>
  );
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "warning";
    case "under investigation":
      return "info";
    case "closed":
      return "success";
    default:
      return "secondary";
  }
}
