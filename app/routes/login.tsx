import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { supabase } from "~/utils/supabaseClient";
import Navbar from "~/components/navbar";

// Handle login submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const emailOrUsername = formData.get("username") as string;
  const password = formData.get("password") as string;

  // If you're only using email for login:
  const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
    email: emailOrUsername,
    password,
  });

  if (loginError || !session) {
    return json({ error: loginError?.message }, { status: 401 });
  }

  const userId = session.user.id;
  // Fetch user profile to determine role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if ( profileError || !profile) {
    return json({ error: "Unable to fetch user role" }, { status: 500 });
  }

  // Redirect based on user role
  switch (profile.role) {
    case "agent":
      return redirect("/lead");
    default:
      return redirect("/dashboard");

  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#212529" }}>
        <div className="card p-4" style={{ minWidth: '300px', maxWidth: '400px', backgroundColor: '#343a40', color: 'white' }}>
          <h3 className="text-center mb-4">Login</h3>

          {/* Show error if login fails */}
          {actionData?.error && (
            <div className="alert alert-danger" role="alert">
              {actionData.error}
            </div>
          )}

          {/* Remix Form handles submission to `action()` */}
          <Form method="post">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Email</label>
              <input type="email" id="username" name="username" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" id="password" name="password" className="form-control" placeholder="Enter your password" required />
            </div>
            <div className="d-flex justify-content-between mb-3">
              <Link to="/forgot-password" prefetch="intent" className="text-decoration-none">Forgot Password?</Link>
              <Link to="/register" prefetch="intent" className="text-decoration-none">Register?</Link>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </Form>
        </div>
      </div>
    </>
  );
}
