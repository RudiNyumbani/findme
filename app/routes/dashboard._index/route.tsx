import { Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import DashNavbar from "~/components/dash-navbar"; // Import the DashNavbar
import { supabase } from "~/utils/supabaseClient"; // import your supabase client


// Loader function to check if the user is authenticated
export async function loader({ request }: { request: Request }) {
  const { data: { session }, error } = await supabase.auth.getSession(); // Get the session from supabase
  
  // Check if user is authenticated
  if (!session) {
    // If not authenticated, redirect to login page
    console.log("User not authenticated, redirecting...");
    return redirect('/login');
  }

  const user = session.user;
  // Fetch reports or any other data you need for the dashboard
  const { data: reports, error: reportsError } = await supabase
    .from("missing_persons")
    .select("case_number, status, date_of_last_contact")
    .eq("reporter_id", user.id); // Fetch reports for the authenticated user

  if (reportsError) {
    console.error("Error fetching user reports:", reportsError.message);
  }

  const activeReportsCount = reports?.filter(r => r.status === "active").length || 0;
  const closedReportsCount = reports?.filter(r=> r.status === "closed").length || 0;

  // Get username from the profile table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
  }

  // Return user data (or anything else you want to pass to the component)
  console.log("User authenticated, redirecting to dashboard");
  return json({ 
    user,
    userReports: reports || [], // Pass the fetched reports to the component
    activeReportsCount,
    closedReportsCount,
    username: profile?.username ?? user.email, // Pass the username to the component, fallback if no username
  });
}



export default function Dashboard() {
  
  const { user, userReports, activeReportsCount, closedReportsCount, username } = useLoaderData<typeof loader>(); // Get the user and reports from the loader data

  return (
    <>
    <DashNavbar />
    <div  className={`container py-5 mt-5 "bg-dark text-light" : ""}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">👋 Welcome, {username}!</h2>
      </div>

      {/* Search Bar */}
      {/*
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search Case Number or Name..."
        />
      </div>
      */}

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
              <p className="display-6 fw-bold">{closedReportsCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">📢 Active Reports</h5>
              <p className="display-6 fw-bold">{activeReportsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h4 className="mt-5 fw-bold">📌 Quick Actions</h4>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <Link to="/dashboard/new-report" className="btn btn-lg btn-primary w-100">
          📋 Report Missing Person
        </Link>
        {/*
        <Link to="/track" className="btn btn-lg btn-secondary w-100">
          🔎 Search & Track
        </Link>
        <Link to="/profile" className="btn btn-lg btn-light w-100">
          👤 View Profile
        </Link>
        */}
      </div>

      {/* User Reports Section */}
      <h4 className="mt-5 fw-bold">📝 Your Reports</h4>
      <div className="list-group">
        {userReports.length > 0 ? (
          userReports.map((report) => (
            <Link
              key={report.caseNumber}
              to={`/cases/${report.case_number}`}
              className="list-group-item list-group-item-action d-flex justify-content-between"
            >
              <span className="fw-bold">{report.case_number} - Status: {report.status}</span>
              <span className="badge bg-secondary">{report.date_of_last_contact}</span>
            </Link>
          ))
        ) : (
          <p className="text-muted">No reports submitted yet.</p>
        )}
      </div>
    </div>
    </>
  );
}
