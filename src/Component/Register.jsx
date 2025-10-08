import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Shield } from 'lucide-react';
import './styles/Register.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'USER' // Default role
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = 'http://localhost:8080/api';

  // Check backend status on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      console.log('🔍 Checking backend connection...');
      
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Backend response status:', response.status);
      
      if (response.status) {
        console.log('Backend is running');
        setBackendStatus('connected');
      } else {
        console.log('No response from backend');
        setBackendStatus('error');
      }

    } catch (error) {
      console.log('Backend connection failed:', error.message);
      setBackendStatus('error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare registration data
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        role: formData.role
      };

      console.log('Attempting to register user:', registrationData);
      console.log('API URL:', `${API_BASE_URL}/auth/register`);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          data = { message: responseText };
        }
      }

      console.log('Parsed data:', data);

      if (response.ok) {
        // Registration successful
        console.log('Registration successful in backend');
        
        // Set success state and show success message
        setRegistrationSuccess(true);
        
        // Show success alert
        alert(`Registration successful! Welcome ${formData.name}. Please login with your credentials.`);
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              preFilledEmail: formData.email,
              message: 'Registration successful! Please login to continue.'
            }
          });
        }, 1500);
        
      } else {
        // Handle specific HTTP errors
        let errorMessage;
        switch (response.status) {
          case 400:
            errorMessage = data.message || 'Bad request - check your input data';
            break;
          case 409:
            errorMessage = data.message || 'User with this email already exists';
            break;
          case 500:
            errorMessage = data.message || 'Server error - please try again later';
            break;
          default:
            errorMessage = data.message || data.error || `Registration failed (${response.status})`;
        }
        
        console.error('Registration failed:', errorMessage);
        setErrors({ submit: errorMessage });
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Registration network error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setErrors({ submit: 'Backend server not reachable. Please make sure the server is running.' });
      } else {
        setErrors({ submit: `Network error: ${error.message}` });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">  
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join RentX and start renting vehicles</p>
          
          {/* Backend Status Indicator
          <div className={`backend-status ${backendStatus}`}>
            {backendStatus === 'connected' && '✅ Backend Connected'}
            {backendStatus === 'error' && '❌ Backend Connection Failed'}
            {backendStatus === 'checking' && '🔍 Checking Backend Connection...'}
          </div> */}

          {/* Success Message */}
          {registrationSuccess && (
            <div className="success-message">
              Registration successful! Redirecting to login...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder=" "
                className="form-input"
                id="name"
                required
              />
              <label htmlFor="name" className="form-label">Full Name *</label>
            </div>
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder=" "
                className="form-input"
                id="email"
                required
              />
              <label htmlFor="email" className="form-label">Email Address *</label>
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Shield className="input-icon" />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-input"
                id="role"
                required
              >
                <option value="">Select Role</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              <label htmlFor="role" className="form-label">Role *</label>
            </div>
            {errors.role && <p className="error-message">{errors.role}</p>}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Phone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder=" "
                className="form-input"
                id="phone"
              />
              <label htmlFor="phone" className="form-label">Phone Number</label>
            </div>
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <MapPin className="input-icon" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder=" "
                className="form-input"
                id="address"
              />
              <label htmlFor="address" className="form-label">Address</label>
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder=" "
                className="form-input"
                id="password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              <label htmlFor="password" className="form-label">Password *</label>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder=" "
                className="form-input"
                id="confirmPassword"
                required
              />
              <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || backendStatus === 'error' || registrationSuccess}
            className="submit-button"
          >
            {isSubmitting ? (
              <div className="loading">
                <div className="spinner"></div>
                Creating Account...
              </div>
            ) : registrationSuccess ? (
              'Registration Successful!'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Already have an account?
            <Link to="/login" className="toggle-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;