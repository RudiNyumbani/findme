import { Link, useLoaderData } from "@remix-run/react";
import AgentNavbar from "~/components/lead-navbar";
import { supabase } from "~/utils/supabaseClient";
import { redirect, json } from "@remix-run/node";

type Case = {
  caseNumber: string;
  type: "Missing";
  status: string;
  date: string;
  assignedTo?: string | null;
};



export async function loader({ request }: { request: Request }) {
  const { data: {session} } = await supabase.auth.getSession();
  if (!session) {
    return redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", session.user.id)
    .single();

  if (error || profile?.role !== "agent") {
    return redirect("/lead/unauthorized");
  }

  const { data: caseData, error: caseError } = await supabase
    .from("missing_persons")
    .select("case_number, status, date_of_last_contact, officer_id, profiles:officer_id (username)");

  if (caseError) {
    console.error("Error fetching cases:", caseError);
    return json({
      user: session.user,
      role: profile.role,
      name: profile.username || "agent",
      cases: [],
    });
  }
  
  const cases: Case[] = (caseData || []).map((c) => ({
    caseNumber: c.case_number,
    type: "Missing",
    status: c.status,
    date: c.date_of_last_contact,
    assignedTo: c.profiles?.username || null,
  }));

  return json({
    user: session.user,
    role: profile.role,
    name: profile.username || "agent",
    cases,
  });
}



export default function AllCasesPage() {
  const { cases } = useLoaderData<typeof loader>();
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
                <th>Status</th>
                <th>Date Reported</th>
                <th>Assigned To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.caseNumber}>
                  <td>
                    <Link to={`/cases/${c.caseNumber}`} className="fw-bold">
                      {c.caseNumber}
                    </Link>
                  </td>
                  
                  <td>
                  <span className={`badge bg-${getStatusColor(c.status)}`}>
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