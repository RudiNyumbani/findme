import { Link, useLoaderData } from "@remix-run/react";
import AgentNavbar from "~/components/lead-navbar"; // You can create this component similar to DashNavbar
import { supabase } from "~/utils/supabaseClient";
import { redirect, json } from "@remix-run/node";

export async function loader({ request }: { request: Request }) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return redirect("/login");
  }

  const user = session.user;
  const { data: reports, error: reportsError } = await supabase
  .from("missing_persons")
  .select("case_number, status, date_of_last_contact")
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
          <Link to="/lead/all-cases" className="btn btn-outline-info w-100">
            📚 View All Cases
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
