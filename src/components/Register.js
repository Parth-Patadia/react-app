import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validatePassword } from '../utils/passwordValidation';
import './styles.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }); // Initialize formData with empty values
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    errors: [],
    isValid: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Check password strength when password field changes
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }

    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      tempErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (storedUsers.some(user => user.email === formData.email)) {
      tempErrors.email = 'Email already registered';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, newUser]));
      
      navigate('/');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Name:</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="form-group mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-group mb-3">
                <label>Password:</label>
                <input
                  type="password"
                  className={`form-control ${errors.password || passwordStrength.errors.length > 0 ? 'is-invalid' : ''}`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {formData.password && (
                  <div className="password-strength mt-2">
                    {passwordStrength.errors.map((error, index) => (
                      <div key={index} className="text-danger small">
                        <i className="fas fa-times-circle"></i> {error}
                      </div>
                    ))}
                    {passwordStrength.isValid && (
                      <div className="text-success small">
                        <i className="fas fa-check-circle"></i> Password is strong
                      </div>
                    )}
                  </div>
                )}
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="form-group mb-3">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Register
              </button>
              <div className="text-center auth-link">
                Already have an account? <Link to="/">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 