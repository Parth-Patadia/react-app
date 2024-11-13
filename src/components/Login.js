import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get stored user data
    const storedUserData = localStorage.getItem('registeredUsers');
    const users = storedUserData ? JSON.parse(storedUserData) : [];
    
    // Find user by email
    const user = users.find(u => u.email === formData.email);
    
    if (!user) {
      setError('Email not found. Please register first.');
      return;
    }

    if (user.password !== formData.password) {
      setError('Invalid password. Please try again.');
      return;
    }

    // Store current user with name
    localStorage.setItem('currentUser', JSON.stringify({
      name: user.name,
      email: user.email
    }));
    
    navigate('/profile');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Login</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
              <div className="text-center auth-link">
                Don't have an account? <Link to="/register">Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 