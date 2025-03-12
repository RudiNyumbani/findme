import { Link } from '@remix-run/react';
// import React from 'react';  // If you plan to use hooks like useState, useEffect, etc., then you’ll need to import React.

const Login = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#212529" }}>
      <div className="card p-4" style={{ minWidth: '300px', maxWidth: '400px', backgroundColor: '#343a40', color: 'white' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username or Email</label>
            <input type="text" id="username" className="form-control" placeholder="Enter your username or email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" className="form-control" placeholder="Enter your password" required />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Link to="#" prefetch="intent" className="text-decoration-none">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
