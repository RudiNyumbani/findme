import { useActionData, Form, Link, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs, redirect, json } from "@remix-run/node";
import { supabase } from "~/utils/supabaseClient"; // Server-side Supabase client

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !email || !password || !confirmPassword) {
    return json({ error: "All fields are required." }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match." }, { status: 400 });
  }

  // Sign up user with Supabase Auth
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError) {
    console.error("Signup Error:", signUpError);
    return json({ error: signUpError.message }, { status: 400 });
  }

  // Insert user details into the profiles table
  if (data.user) {
    const { error: insertError } = await supabase.from("profiles").insert([{ id: data.user.id, username, email }]);

    if (insertError) {
      console.error("Database Insert Error:", insertError);
      return json({ error: "Account created, but failed to save profile. Contact support." }, { status: 500 });
    }
  }

  return redirect("/dashboard"); // Redirect after successful signup
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#212529" }}>
      <div className="card p-4" style={{ minWidth: '400px', maxWidth: '400px', backgroundColor: '#343a40', color: 'white' }}>
        <h3 className="text-center mb-4">Register</h3>
        {actionData?.error && <div className="alert alert-danger">{actionData.error}</div>}
        
        <Form method="post">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" name="username" id="username" className="form-control" placeholder="Choose a username" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" name="email" id="email" className="form-control" placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" name="password" id="password" className="form-control" placeholder="Create a password" required />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" placeholder="Confirm your password" required />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Link to="/login" prefetch="intent" className="text-decoration-none">Already have an account? Login</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </Form>
      </div>
    </div>
  );
}
