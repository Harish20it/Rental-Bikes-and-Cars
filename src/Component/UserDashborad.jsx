import React, { useState, useEffect, useCallback } from 'react';
import { User, Car, Bike, Gift, LogOut, Award, TrendingUp, Zap, Clock, Home, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './styles/UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicleFilter, setVehicleFilter] = useState('cars');
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    amount: 0
  });

  // API Base URL
  const API_BASE_URL = 'http://localhost:8080/api';

  // Features data matching MainPage style
  const features = [
    {
      icon: <Award size={40} />,
      title: "Premium Quality",
      description: "Well-maintained vehicles with regular servicing and quality checks",
      color: "#10b981"
    },
    {
      icon: <Clock size={40} />,
      title: "24/7 Support",
      description: "Round-the-clock customer support and roadside assistance",
      color: "#3b82f6"
    },
    {
      icon: <TrendingUp size={40} />,
      title: "Best Prices",
      description: "Competitive pricing with no hidden charges",
      color: "#f59e0b"
    },
    {
      icon: <Zap size={40} />,
      title: "Instant Booking",
      description: "Quick and easy booking process with instant confirmation",
      color: "#8b5cf6"
    }
  ];

  // Load user data on component mount - FIXED: Added dependency array
  useEffect(() => {
    loadUserData();
    fetchInitialData();
  }, []); // Empty dependency array = run only once on mount

  // Fetch vehicles from backend - useCallback to prevent recreation
  const fetchVehicles = useCallback(async () => {
    try {
      console.log('Fetching vehicles from:', `${API_BASE_URL}/vehicles`);
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Vehicles API Response:', data);
      
      let vehicles = [];
      
      if (Array.isArray(data)) {
        vehicles = data;
      } else if (data.content && Array.isArray(data.content)) {
        vehicles = data.content;
      } else if (data.data && Array.isArray(data.data)) {
        vehicles = data.data;
      } else if (data.vehicles && Array.isArray(data.vehicles)) {
        vehicles = data.vehicles;
      } else if (data.cars && data.bikes) {
        const carsWithType = (data.cars || []).map(car => ({ ...car, type: 'CAR' }));
        const bikesWithType = (data.bikes || []).map(bike => ({ ...bike, type: 'BIKE' }));
        vehicles = [...carsWithType, ...bikesWithType];
      } else {
        console.warn('Unexpected API response format:', data);
        throw new Error('Unexpected API response format');
      }
      
      console.log('Processed vehicles:', vehicles);
      
      const available = vehicles.filter(v => v.available && !v.damaged);
      setAvailableVehicles(available);
      
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles from backend.');
      setAvailableVehicles([
        { 
          id: 1, 
          name: 'Toyota Camry', 
          model: '2023', 
          number: 'AB123CD', 
          rentCost: 2500, 
          type: 'CAR', 
          available: true, 
          damaged: false 
        },
        { 
          id: 2, 
          name: 'Honda CBR', 
          model: '2023', 
          number: 'XY789Z', 
          rentCost: 1200, 
          type: 'BIKE', 
          available: true, 
          damaged: false 
        }
      ]);
    }
  }, []);

  // Fetch offers from backend - useCallback to prevent recreation
  const fetchOffers = useCallback(async () => {
    try {
      console.log('Fetching offers from:', `${API_BASE_URL}/offers`);
      
      const response = await fetch(`${API_BASE_URL}/offers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📡 Offers API Response:', data);
      
      let offers = [];
      
      if (Array.isArray(data)) {
        offers = data;
      } else if (data.content && Array.isArray(data.content)) {
        offers = data.content;
      } else if (data.data && Array.isArray(data.data)) {
        offers = data.data;
      } else if (data.offers && Array.isArray(data.offers)) {
        offers = data.offers;
      } else {
        console.warn('Unexpected offers API response format:', data);
        throw new Error('Unexpected API response format');
      }
      
      setActiveOffers(offers);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setActiveOffers([
        { 
          id: 1, 
          title: 'New Year Special', 
          discount: '15% OFF', 
          validTill: '2024-12-31', 
          active: true,
          description: 'Get 15% off on all vehicle rentals'
        },
        { 
          id: 2, 
          title: 'Weekend Discount', 
          discount: '10% OFF', 
          validTill: '2024-12-15', 
          active: true,
          description: 'Special weekend rates for all customers'
        }
      ]);
    }
  }, []);

  // Sequential API calls to prevent overwhelming the browser
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await fetchVehicles();
      await new Promise(resolve => setTimeout(resolve, 100));
      await fetchOffers();
    } catch (error) {
      console.error('Error in sequential data loading:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchVehicles, fetchOffers]);

  // Load user from localStorage or context
  const loadUserData = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('👤 Loaded user:', userData);
      } else {
        console.warn('No user data found, redirecting to login');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    console.log('User logged out');
    alert('Logged out successfully!');
    navigate('/login');
  };

  const handleGoToMainPage = () => {
    navigate('/');
  };

  // Open payment modal when user clicks rent
  const handleRentClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setPaymentForm(prev => ({
      ...prev,
      amount: vehicle.rentCost
    }));
    setShowPaymentModal(true);
  };

  // Handle payment form changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Process payment and then rent the vehicle
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Validate payment details
      if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardHolder) {
        alert('Please fill all payment details');
        return;
      }

      // Simulate payment processing
      console.log('💳 Processing payment:', {
        amount: paymentForm.amount,
        vehicle: selectedVehicle.name
      });

      // Simulate API call for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // If payment is successful, proceed with booking
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          paymentAmount: paymentForm.amount,
          paymentMethod: 'Credit Card'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const booking = await response.json();
      
      // Close payment modal and show success
      setShowPaymentModal(false);
      setPaymentForm({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: '',
        amount: 0
      });
      
      alert(`Payment successful! You have rented ${selectedVehicle.name} (${selectedVehicle.number})!\nBooking ID: ${booking.id}\nAmount Paid: ₹${paymentForm.amount}`);
      
    } catch (err) {
      console.error('Payment/Booking error:', err);
      alert(`Payment failed. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered vehicles for display
  const getFilteredAvailableVehicles = () => {
    return availableVehicles.filter(v => 
      vehicleFilter === 'cars' ? v.type === 'CAR' : v.type === 'BIKE'
    );
  };

  const renderDashboard = () => {
    const stats = {
      totalAvailable: availableVehicles.length,
      availableCars: availableVehicles.filter(v => v.type === 'CAR').length,
      availableBikes: availableVehicles.filter(v => v.type === 'BIKE').length,
      activeOffers: activeOffers.length
    };

    return (
      <div className="tab-content">
        <div className="dashboard-header">
          <h2>Welcome back, {user?.name}!</h2>
          <p>Here's your rental dashboard overview</p>
        </div>

        {/* Stats Cards */}
        <div className="summary-cards">
          <div className="stat-card">
            <div className="stat-icon"><Car size={24} /></div>
            <h3>{stats.availableCars}</h3>
            <p>Available Cars</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Bike size={24} /></div>
            <h3>{stats.availableBikes}</h3>
            <p>Available Bikes</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Gift size={24} /></div>
            <h3>{stats.activeOffers}</h3>
            <p>Active Offers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><User size={24} /></div>
            <h3>{user?.totalBookings ?? 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="btn-primary" 
              onClick={() => setActiveTab('vehicles')}
            >
              <Car size={20} />
              Browse Vehicles
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => setActiveTab('offers')}
            >
              <Gift size={20} />
              View Offers
            </button>
            <button 
              className="btn-outline" 
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              My Profile
            </button>
          </div>
        </div>

        {/* Features Section matching MainPage */}
        <div className="features-section">
          <div className="section-header">
            <h2>Why Choose RentX?</h2>
            <p>Experience the best vehicle rental service with our premium features</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderVehicles = () => {
    const filteredVehicles = getFilteredAvailableVehicles();
    
    return (
      <div className="tab-content">
        <div className="tab-header">
          <h2>Available Vehicles</h2>
          <p>Choose from our well-maintained fleet of vehicles</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading vehicles...</div>}

        <div className="vehicle-filter">
          <button
            className={vehicleFilter === 'cars' ? 'active' : ''}
            onClick={() => setVehicleFilter('cars')}
          >
            <Car size={16} /> Cars
          </button>
          <button
            className={vehicleFilter === 'bikes' ? 'active' : ''}
            onClick={() => setVehicleFilter('bikes')}
          >
            <Bike size={16} /> Bikes
          </button>
        </div>

        <div className="vehicles-grid">
          {filteredVehicles.length === 0 && !loading ? (
            <div className="no-vehicles">
              <Car size={48} />
              <p>No vehicles available in this category.</p>
            </div>
          ) : (
            filteredVehicles.map(v => (
              <div key={v.id} className="vehicle-card">
                <div className="vehicle-icon">
                  {v.type === 'CAR' ? <Car size={32} /> : <Bike size={32} />}
                </div>
                <h3>{v.name}</h3>
                <p className="vehicle-model">{v.model}</p>
                <p className="vehicle-number">{v.number}</p>
                <div className="vehicle-price">₹{v.rentCost}/day</div>
                <button
                  className="rent-button"
                  onClick={() => handleRentClick(v)}
                  disabled={loading}
                >
                  <CreditCard size={16} />
                  {loading ? 'Processing...' : 'Rent Now'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderOffers = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Special Offers</h2>
        <p>Take advantage of our current promotions and discounts</p>
      </div>
      <div className="offers-grid">
        {activeOffers.map(o => (
          <div key={o.id} className="offer-card">
            <div className="offer-header">
              <Gift className="offer-icon" />
              <h4>{o.title}</h4>
            </div>
            <div className="offer-discount">{o.discount}</div>
            <p className="offer-description">{o.description || 'Special offer for our valued customers'}</p>
            <p className="offer-validity">Valid till: {new Date(o.validTill).toLocaleDateString()}</p>
            <button className="btn-primary">Apply Offer</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>My Profile</h2>
        <p>Manage your account information and preferences</p>
      </div>
      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-avatar">
            <User size={48} />
            {user?.role === 'ADMIN' && <span className="admin-badge">ADMIN</span>}
          </div>
          <div className="profile-details">
            <h2>{user?.name || 'Guest User'}</h2>
            <p className="email">{user?.email || 'No email provided'}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <strong>Member Since:</strong> 
                <span>{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : '2024-01-01'}</span>
              </div>
              <div className="stat-item">
                <strong>Total Bookings:</strong> 
                <span>{user?.totalBookings ?? 0}</span>
              </div>
              <div className="stat-item">
                <strong>Vehicles Rented:</strong> 
                <span>{user?.totalBookings ?? 0}</span>
              </div>
            </div>
            <div className="contact-info">
              <h4>Contact Information</h4>
              <div className="stat-item">
                <strong>Phone:</strong> 
                <span>{user?.phone || 'Not provided'}</span>
              </div>
              <div className="stat-item">
                <strong>Address:</strong> 
                <span>{user?.address || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-primary">Edit Profile</button>
          <button className="btn-secondary">Change Password</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'vehicles': return renderVehicles();
      case 'offers': return renderOffers();
      case 'profile': return renderProfile();
      default: return renderDashboard();
    }
  };

  // Show loading while user data is being loaded
  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="loading-fullscreen">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <div className="modal-header">
              <h3>Complete Payment</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPaymentModal(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <div className="payment-summary">
              <h4>Booking Summary</h4>
              <div className="summary-details">
                <p><strong>Vehicle:</strong> {selectedVehicle?.name}</p>
                <p><strong>Model:</strong> {selectedVehicle?.model}</p>
                <p><strong>Number:</strong> {selectedVehicle?.number}</p>
                <p><strong>Rent per day:</strong> ₹{selectedVehicle?.rentCost}</p>
                <div className="total-amount">
                  <strong>Total Amount: ₹{paymentForm.amount}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  value={paymentForm.cardHolder}
                  onChange={handlePaymentChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentForm.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentForm.expiryDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentForm.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <div className="security-notice">
                <Shield size={16} />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <CreditCard size={16} />
                  {loading ? 'Processing...' : `Pay ₹${paymentForm.amount}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <nav className="user-navbar">
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">RentX</span>
        </div>
        <ul className="nav-links">
          <li>
            <button 
              onClick={handleGoToMainPage} 
              className="main-page-btn"
            >
              <Home size={16} />
              Main
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={activeTab === 'dashboard' ? 'active' : ''}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('vehicles')} 
              className={activeTab === 'vehicles' ? 'active' : ''}
            >
              Vehicles
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('offers')} 
              className={activeTab === 'offers' ? 'active' : ''}
            >
              Offers
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={activeTab === 'profile' ? 'active' : ''}
            >
              👤 Profile
            </button>
          </li>
        </ul>
        <div className="user-info">
          <span>Welcome, {user?.name || 'User'}</span>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserDashboard;