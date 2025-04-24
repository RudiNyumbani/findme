import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import AgentNavbar from "~/components/lead-navbar"; // You can create this component similar to DashNavbar
import { supabase } from "~/utils/supabaseClient";
import { redirect, json } from "@remix-run/node";
import { useState } from "react";

export async function loader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return redirect("/login");
  }

  const user = session.user;
  const { data: reports, error: reportsError } = await supabase
  .from("missing_persons")
  .select("case_number, status, date_of_last_contact, legal_first_name, legal_last_name")
  .eq("officer_id", user.id); // Fetch reports for the authenticated user
  if (reportsError) {
    console.error("Error fetching user reports:", reportsError.message);
  }
  const activeReportsCount = reports?.filter(r => r.status === "active").length || 0;
  const closedReportsCount = reports?.filter(r=> r.status === "closed").length || 0;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", session.user.id)
    .single();
  if (error || profile?.role !== "agent") {
    return redirect("/lead/unauthorized");
  }
  return json({
    user: session.user,
    role: profile.role,
    name: profile.username || "agent",
    activeReportsCount,
    closedReportsCount,
    userReports: reports || [], // Pass the fetched reports to the component
  });
}


export default function AgentDashboard() {
  const { name, userReports, activeReportsCount, closedReportsCount } = useLoaderData<typeof loader>();

  const [selectedCase, setSelectedCase] = useState<null | {
    case_number: string;
    status: string;
  }>(null);
  
  const fetcher = useFetcher();
  
  return (
    <>
      <AgentNavbar />
      <div className={`container py-5 mt-5 "bg-dark text-light" : ""}`}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Welcome, Agent {name}</h2>
         
        </div>

        {/* Stats Section */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">📂 Handled Cases</h5>
                <p className="display-6 fw-bold">{userReports.length}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <h5 className="card-title">🕵️‍♂️ Under Investigation</h5>
                <p className="display-6 fw-bold">{activeReportsCount}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">✅ Closed Cases</h5>
                <p className="display-6 fw-bold">{closedReportsCount}
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
                <th>Date of Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userReports.map((caseData) => (
                <tr key={caseData.case_number}>
                  <td>{caseData.case_number}</td>
                  <td>{caseData.legal_first_name + " " + caseData.legal_last_name}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(caseData.status)}`}>
                      {caseData.status}
                    </span>
                  </td>
                  <td>{caseData.date_of_last_contact}</td>
                  <td>
                    <Link
                      to={`/cases/${caseData.case_number}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      View
                    </Link>
                    <button className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSelectedCase({ case_number: caseData.case_number, status: caseData.status })}
                    data-bs-toggle = "modal"
                    data-bs-target = "#statusModal"
                    >
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
          <Link to="/lead/all-cases" className="btn btn-outline-info w-100">
            📚 View All Cases
          </Link>
          
        </div>

        {/* Update Status Modal */}
        <div
          className="modal fade"
          id="statusModal"
          tabIndex={-1}
          aria-labelledby="statusModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content text-dark">
              <div className="modal-header">
                <h5 className="modal-title" id="statusModalLabel">
                  Update Case Status
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <fetcher.Form method="post" action="/lead/update-status">
                <div className="modal-body">
                  <input type="hidden" name="case_number" value={selectedCase?.case_number || ""} />
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      New Status
                    </label>
                    <select
                      className="form-select"
                      name="status"
                      id="status"
                      value = {selectedCase?.status || ""}
                      onChange = {(e) =>
                        setSelectedCase((prev) => 
                          prev ? { ...prev, status: e.target.value } : prev
                        )
                      }
                      required
                    >
                      <option value="pending">Apending</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </div>
              </fetcher.Form>
            </div>
          </div>
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
