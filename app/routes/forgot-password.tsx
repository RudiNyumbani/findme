import { Link } from '@remix-run/react';
import Navbar from "~/components/navbar"; // Import Navbar
// import React from 'react';  // Uncomment if using hooks

const ForgotPassword = () => {
  return (
    <>
    <Navbar />
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#212529" }}>
      <div className="card p-4" style={{ minWidth: '300px', maxWidth: '400px', backgroundColor: '#343a40', color: 'white' }}>
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" className="form-control" placeholder="Enter your registered email" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
        </form>
        <div className="text-center mt-3">
          <Link to="/login" prefetch="intent" className="text-decoration-none">Back to Login</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default ForgotPassword;
