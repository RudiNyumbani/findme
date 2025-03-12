import { Link } from '@remix-run/react';

const Register = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#212529" }}>
      <div className="card p-4" style={{ minWidth: '300px', maxWidth: '400px', backgroundColor: '#343a40', color: 'white' }}>
        <h3 className="text-center mb-4">Register</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" id="username" className="form-control" placeholder="Choose a username" required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" className="form-control" placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" className="form-control" placeholder="Create a password" required />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input type="password" id="confirmPassword" className="form-control" placeholder="Confirm your password" required />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Link to="/login" prefetch="intent" className="text-decoration-none">Already have an account? Login</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
