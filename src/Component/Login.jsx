import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import axios from 'axios';
import './styles/Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER' // Default role
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const navigate = useNavigate();
  const location = useLocation();

  // API Base URL
  const API_BASE_URL = 'http://localhost:8080/api';

  // Create axios instance with base configuration
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
  });

  // Check backend status on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Handle pre-filled email from registration
  useEffect(() => {
    if (location.state?.preFilledEmail) {
      setFormData(prev => ({
        ...prev,
        email: location.state.preFilledEmail
      }));
    }
  }, [location.state]);

  const checkBackendConnection = async () => {
    try {
      console.log('Checking backend connection...');
      
      const response = await api.get('/vehicles');
      
      console.log('Backend response status:', response.status);
      
      if (response.status === 200) {
        console.log('Backend is running');
        setBackendStatus('connected');
      } else {
        console.log('Backend returned non-200 status');
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      };

      console.log('Attempting login:', { ...loginData, password: '***' });
      console.log('API URL:', `${API_BASE_URL}/auth/login`);

      const response = await api.post('/auth/login', loginData);

      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);

      if (response.status === 200 && response.data.token) {
        // Login successful
        console.log('Login successful:', response.data.user);
        
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        alert(`Welcome back, ${response.data.user.name}!`);
        
        // Navigate based on role
        if (response.data.user.role === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        // Login failed
        const errorMessage = response.data.message || response.data.error || 'Invalid email or password';
        console.error('Login failed:', errorMessage);
        setErrors({ submit: errorMessage });
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('🚨 Login error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           `Login failed (${error.response.status})`;
        console.error('Login failed with status:', error.response.status);
        setErrors({ submit: errorMessage });
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        setErrors({ submit: 'No response from server. Please check if the backend is running.' });
      } else {
        // Other errors
        setErrors({ submit: `Error: ${error.message}` });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your RentX account</p>
          
          {/* Backend Status Indicator
          <div className={`backend-status ${backendStatus}`}>
            {backendStatus === 'connected' && '✅ Backend Connected'}
            {backendStatus === 'error' && '❌ Backend Connection Failed'}
            {backendStatus === 'checking' && '🔍 Checking Backend Connection...'}
          </div> */}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
              <label htmlFor="email" className="form-label">Email Address</label>
            </div>
            {errors.email && <p className="error-message">{errors.email}</p>}
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
              <label htmlFor="password" className="form-label">Password</label>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
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
              <label htmlFor="role" className="form-label">Role</label>
            </div>
            {errors.role && <p className="error-message">{errors.role}</p>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || backendStatus === 'error'}
            className="submit-button"
          >
            {isSubmitting ? (
              <div className="loading">
                <div className="spinner"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="form-footer">
          <p>
            Don't have an account?
            <Link to="/register" className="toggle-link">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;