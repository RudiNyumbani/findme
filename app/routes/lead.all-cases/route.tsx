import { Link } from "@remix-run/react";
import AgentNavbar from "~/components/lead-navbar";

type Case = {
  caseNumber: string;
  type: "Missing" | "Unidentified" | "Unclaimed";
  status: string;
  date: string;
  assignedTo?: string | null;
};

const allCases: Case[] = [
  {
    caseNumber: "MSP-2025-00A7",
    type: "Missing",
    status: "pending",
    date: "2025-04-19",
    assignedTo: null,
  },
  {
    caseNumber: "UNP-2025-00B3",
    type: "Unidentified",
    status: "active",
    date: "2025-03-10",
    assignedTo: "Agent007",
  },
  {
    caseNumber: "UNC-2025-00C2",
    type: "Unclaimed",
    status: "closed",
    date: "2025-02-15",
    assignedTo: null,
  },
];

export default function AllCasesPage() {
  return (
    <>
      <AgentNavbar />
      <div className="container mt-5">
        <h2 className="fw-bold mb-4">📁 All Reported Cases</h2>

        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Case Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date Reported</th>
                <th>Assigned To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allCases.map((c) => (
                <tr key={c.caseNumber}>
                  <td>
                    <Link to={`/cases/${c.caseNumber}`} className="fw-bold">
                      {c.caseNumber}
                    </Link>
                  </td>
                  <td>{c.type}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === "closed"
                          ? "bg-secondary"
                          : c.status === "active"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>{c.date}</td>
                  <td>{c.assignedTo || <em>Unassigned</em>}</td>
                  <td>
                    {!c.assignedTo ? (
                      <button className="btn btn-sm btn-primary">
                        ✅ Take Case
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline-secondary" disabled>
                        Assigned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
