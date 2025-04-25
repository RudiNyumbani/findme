import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import AgentNavbar from "~/components/lead-navbar";
import { supabase } from "~/utils/supabaseClient";
import { redirect, json , ActionFunction} from "@remix-run/node";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Toast, ToastContainer} from "react-bootstrap";



/**
 * Handles the loader for the lead dashboard route.
 *
 * Fetches the authenticated user from Supabase Auth, then fetches the
 * user's reports from the `missing_persons` table. It also fetches the
 * user's profile from the `profiles` table to determine if they have
 * the "agent" role.
 *
 * Returns a JSON response with the following data:
 * - user: The authenticated user
 * - role: The authenticated user's role
 * - name: The authenticated user's username, or "agent" if no username
 * - activeReportsCount: The number of active reports for the user
 * - closedReportsCount: The number of closed reports for the user
 * - userReports: The list of reports for the user
 *
 * If there is no session for the user, it redirects to /login.
 * If the user does not have the "agent" role, it redirects to /lead/unauthorized.
 */
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


  /**
   * Handle form submission from the agent dashboard to update a case status.
   * Expects the following form data:
   * - case_number: string
   * - status: string
   * If the input is invalid, returns a 400 response with an error message.
   * If there is an error updating the case status in Supabase,
   * returns a 500 response with the error message.
   * On success, redirects back to the agent dashboard.
   */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const caseNumber = formData.get("case_number") as string;
  const newStatus = formData.get("status") as string;

  // Ensure valid input
  if (!caseNumber || !newStatus) {
    return json({ error: "Missing data" }, { status: 400 });
  }

  // Update the case status in Supabase
  const { error } = await supabase
    .from("missing_persons")
    .update({ status: newStatus })
    .eq("case_number", caseNumber);

  if (error) {
    console.error("Error updating status:", error.message);
    return json({ error: error.message }, { status: 500 });
  }

  
  return json({ success: true }, { status: 200 });
};



/**
 * AgentDashboard component renders the main dashboard interface for agents.
 * It displays summary statistics of cases handled by the agent, including
 * the number of handled, active, and closed cases. The component also provides
 * a table of assigned cases with options to view details or update the case status.
 * 
 * The component manages state for the selected case for status updates and
 * displays a toast notification upon successful status updates. It also uses
 * the `useFetcher` hook to handle form submissions for updating case statuses.
 * 
 * @returns JSX.Element - The rendered agent dashboard interface
 */

export default function AgentDashboard() {
  const { name, userReports, activeReportsCount, closedReportsCount } = useLoaderData<typeof loader>();
  const [selectedCase, setSelectedCase] = useState<null | {
    case_number: string;
    status: string;
  }>(null);
  
  const fetcher = useFetcher();

  const [showToast, setShowToast] = useState(false);
  // Handle modal close and toast display
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && !fetcher.data.error) {
      setSelectedCase(null);
      setShowToast(true);
    }
  }, [fetcher.state, fetcher.data]);
  
  
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
          <Link prefetch="intent" to="/lead/all-cases" className="btn btn-outline-info w-100">
            📚 View All Cases
          </Link>
          
        </div>

        {/* Update Status Modal */}
        <Modal
        show={selectedCase !== null}
        onHide={() => setSelectedCase(null)}
        backdrop="static"
        keyboard={false}
        >
          <fetcher.Form method="post">
            <Modal.Header closeButton>
              <Modal.Title>Update Case Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input type="hidden" name="case_number" value={selectedCase?.case_number || ""} />
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>New Status</Form.Label>
                <Form.Select
                  name="status"
                  value={selectedCase?.status || ""}
                  onChange={(e) =>
                    setSelectedCase((prev) =>
                      prev ? { ...prev, status: e.target.value } : prev
                    )
                  }
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedCase(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Modal.Footer>
          </fetcher.Form>
        </Modal>
              
        <ToastContainer
          position="top-center"
          className="p-3"
          style={{ zIndex: 9999 }}
        >
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            bg="success"
          >
            <Toast.Header closeButton>
              <strong className="me-auto">Status Updated</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              ✅ Case status was updated successfully!
            </Toast.Body>
          </Toast>
        </ToastContainer>

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
