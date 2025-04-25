import { Link, useLoaderData } from "@remix-run/react";
import AgentNavbar from "~/components/lead-navbar";
import { supabase } from "~/utils/supabaseClient";
import { redirect, json } from "@remix-run/node";

type Case = {
  caseNumber: string;
  status: string;
  date: string;
  assignedTo?: string | null;
};

const allCases: Case[] = [
  {
    caseNumber: "MSP-2025-00A7",
    status: "pending",
    date: "2025-04-19",
    assignedTo: null,
  },
  {
    caseNumber: "UNP-2025-00B3",
    status: "active",
    date: "2025-03-10",
    assignedTo: "Agent007",
  },
  {
    caseNumber: "UNC-2025-00C2",
    status: "closed",
    date: "2025-02-15",
    assignedTo: null,
  },
];

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

  return json({
    user: session.user,
    role: profile.role,
    name: profile.username || "agent",
  });
}



export default function AllCasesPage() {
  const { name } = useLoaderData<typeof loader>();
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
              {allCases.map((c) => (
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