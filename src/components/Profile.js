import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      navigate('/');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      });
    }
  }, [navigate]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000); // 3 seconds

      // Cleanup timer
      return () => clearTimeout(timer);
    }
  }, [success]); // Run effect when success message changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update in registeredUsers array
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map(u => {
      if (u.email === user.email) {
        return { ...u, name: formData.name, email: formData.email };
      }
      return u;
    });
    
    // Update stored data
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(formData));
    
    setUser(formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    // Get current user's data from registeredUsers
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const currentUser = registeredUsers.find(u => u.email === user.email);

    // Verify current password
    if (currentUser.password !== passwordData.currentPassword) {
      setError('Current password is incorrect');
      return;
    }

    // Update password
    const updatedUsers = registeredUsers.map(u => {
      if (u.email === user.email) {
        return { ...u, password: passwordData.newPassword };
      }
      return u;
    });

    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Reset form and show success message
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setSuccess('Password successfully updated');
    setIsChangingPassword(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4">Profile</h2>
            
            {success && (
              <div className="alert alert-success mb-3 fade show" role="alert">
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label>Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary flex-grow-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : isChangingPassword ? (
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group mb-3">
                  <label>Current Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary flex-grow-1"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="mb-3">
                  <strong>Name:</strong> {user.name}
                </div>
                <div className="mb-4">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-info flex-grow-1"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </button>
                  <button
                    className="btn btn-danger flex-grow-1"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 