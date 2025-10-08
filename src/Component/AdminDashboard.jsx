import React, { useState, useEffect, useCallback } from 'react';
import { Car, Bike, CreditCard, Users, LogOut, Plus, Check, X, Gift, User, Shield, AlertTriangle, RefreshCw, Edit, Trash2, Wrench, Star, TrendingUp, Zap, Clock, Award, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [state, setState] = useState({
    activeTab: 'overview',
    activeRentalTab: 'pending',
    vehicles: { cars: [], bikes: [] },
    payments: [],
    offers: [],
    users: [],
    rentals: [],
    showAddVehicleForm: false,
    showAddOfferForm: false,
    showModal: false,
    showRentalModal: false,
    selectedType: "cars",
    selectedVehicleId: "",
    selectedRental: null,
    loading: false,
    error: '',
    backendStatus: 'checking',
    newVehicle: { type: 'car', name: '', model: '', number: '', rentCost: '', available: true, damaged: false },
    newOffer: { title: '', discount: '', validTill: '', active: true }
  });

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8080/api';

  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  useEffect(() => {
    checkBackendConnection();
    loadDashboardData();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      updateState({ backendStatus: response.ok ? 'connected' : 'error' });
    } catch {
      updateState({ backendStatus: 'disconnected' });
    }
  };

  const loadDashboardData = async () => {
    if (state.backendStatus === 'disconnected') {
      useDemoData();
      return;
    }
    
    try {
      updateState({ loading: true });
      await Promise.all([fetchVehicles(), fetchPayments(), fetchOffers(), fetchUsers(), fetchRentals()]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      updateState({ backendStatus: 'disconnected' });
      useDemoData();
    } finally {
      updateState({ loading: false });
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      let vehiclesData = [];
      if (data.cars && data.bikes) {
        const carsWithType = (data.cars || []).map(car => ({ ...car, type: 'CAR' }));
        const bikesWithType = (data.bikes || []).map(bike => ({ ...bike, type: 'BIKE' }));
        vehiclesData = [...carsWithType, ...bikesWithType];
      } else if (Array.isArray(data)) vehiclesData = data;
      const cars = vehiclesData.filter(v => v.type === 'CAR');
      const bikes = vehiclesData.filter(v => v.type === 'BIKE');
      updateState({ vehicles: { cars, bikes } });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`);
      if (response.ok) {
        updateState({ payments: await response.json() });
      } else {
        updateState({ payments: [] });
      }
    } catch (error) { 
      console.error('Error fetching payments:', error);
      updateState({ payments: [] });
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/offers`);
      if (response.ok) {
        updateState({ offers: await response.json() });
      } else {
        updateState({ offers: [] });
      }
    } catch (error) { 
      console.error('Error fetching offers:', error);
      updateState({ offers: [] });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (response.ok) {
        updateState({ users: await response.json() });
      } else {
        updateState({ users: [] });
      }
    } catch (error) { 
      console.error('Error fetching users:', error);
      updateState({ users: [] });
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rentals`);
      if (response.ok) {
        const rentals = await response.json();
        updateState({ rentals });
      } else {
        updateState({ rentals: [] });
      }
    } catch (error) { 
      console.error('Error fetching rentals:', error);
      updateState({ rentals: [] });
    }
  };

  const useDemoData = () => {
    console.log('🎭 Using demo data for admin dashboard');
    const demoData = {
      vehicles: {
        cars: [
          { id: 1, name: 'Toyota Camry', model: '2023', number: 'AB123CD', rentCost: 2500, available: true, damaged: false, type: 'CAR' },
          { id: 2, name: 'Honda Accord', model: '2023', number: 'EF456GH', rentCost: 2800, available: false, damaged: true, type: 'CAR' },
          { id: 3, name: 'Ford Mustang', model: '2024', number: 'IJ789KL', rentCost: 4500, available: true, damaged: false, type: 'CAR' }
        ],
        bikes: [
          { id: 1, name: 'Honda CBR', model: '2023', number: 'XY789Z', rentCost: 800, available: true, damaged: false, type: 'BIKE' },
          { id: 2, name: 'Yamaha R1', model: '2023', number: 'PQ456R', rentCost: 1200, available: true, damaged: false, type: 'BIKE' },
          { id: 3, name: 'Kawasaki Ninja', model: '2024', number: 'ST123U', rentCost: 1500, available: false, damaged: true, type: 'BIKE' }
        ]
      },
      payments: [
        { id: 1, user: 'John Doe', amount: 5000, date: '2024-01-20', status: 'pending' },
        { id: 2, user: 'Jane Smith', amount: 2800, date: '2024-01-19', status: 'completed' },
        { id: 3, user: 'Mike Johnson', amount: 7500, date: '2024-01-21', status: 'pending' }
      ],
      offers: [
        { id: 1, title: 'New Year Offer', discount: '15%', validTill: '2024-01-31', active: true },
        { id: 2, title: 'Weekend Special', discount: '10%', validTill: '2024-02-05', active: true },
        { id: 3, title: 'Winter Discount', discount: '20%', validTill: '2024-02-15', active: false }
      ],
      users: [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', joinDate: '2024-01-15', totalBookings: 5, role: 'USER' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', joinDate: '2024-02-10', totalBookings: 3, role: 'USER' },
        { id: 3, name: 'Admin User', email: 'admin@rentx.com', joinDate: '2024-01-01', totalBookings: 0, role: 'ADMIN' }
      ],
      rentals: [
        { 
          id: 1, 
          userId: 1, 
          userName: 'John Doe', 
          userEmail: 'john.doe@example.com',
          vehicleId: 1, 
          vehicleName: 'Toyota Camry', 
          vehicleType: 'CAR',
          startDate: '2024-01-25', 
          endDate: '2024-01-28', 
          totalCost: 7500, 
          status: 'pending',
          pickupLocation: 'Bangalore',
          bookingDate: '2024-01-20'
        },
        { 
          id: 2, 
          userId: 2, 
          userName: 'Jane Smith', 
          userEmail: 'jane.smith@example.com',
          vehicleId: 4, 
          vehicleName: 'Honda CBR', 
          vehicleType: 'BIKE',
          startDate: '2024-01-26', 
          endDate: '2024-01-30', 
          totalCost: 3200, 
          status: 'confirmed',
          pickupLocation: 'Mumbai',
          bookingDate: '2024-01-21'
        },
        { 
          id: 3, 
          userId: 1, 
          userName: 'John Doe', 
          userEmail: 'john.doe@example.com',
          vehicleId: 3, 
          vehicleName: 'Ford Mustang', 
          vehicleType: 'CAR',
          startDate: '2024-02-01', 
          endDate: '2024-02-05', 
          totalCost: 18000, 
          status: 'pending',
          pickupLocation: 'Delhi',
          bookingDate: '2024-01-22'
        }
      ]
    };
    updateState(demoData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isDemo');
    alert('Logged out successfully!');
    navigate('/login');
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    updateState({ 
      newVehicle: { 
        ...state.newVehicle, 
        [name]: name === 'rentCost' ? Number(value) : (name === 'available' || name === 'damaged') ? value === 'true' : value 
      } 
    });
  };

  const handleSubmitVehicle = async (e) => {
    e.preventDefault();
    if (state.backendStatus === 'disconnected') {
      const id = state.newVehicle.type === 'car' ? state.vehicles.cars.length + 1 : state.vehicles.bikes.length + 1;
      const vehicleToAdd = { ...state.newVehicle, id, type: state.newVehicle.type === 'car' ? 'CAR' : 'BIKE' };
      const key = state.newVehicle.type === 'car' ? 'cars' : 'bikes';
      updateState({ 
        vehicles: { ...state.vehicles, [key]: [...state.vehicles[key], vehicleToAdd] } 
      });
      alert('DEMO: New vehicle added!');
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...state.newVehicle, type: state.newVehicle.type === 'car' ? 'CAR' : 'BIKE' }),
        });
        if (response.ok) { alert('Vehicle added successfully!'); fetchVehicles(); }
        else throw new Error('Failed to add vehicle');
      } catch{ alert('Failed to add vehicle'); }
    }
    updateState({ showAddVehicleForm: false, newVehicle: { type: 'car', name: '', model: '', number: '', rentCost: '', available: true, damaged: false } });
  };

  const handleOfferInputChange = (e) => {
    const { name, value } = e.target;
    updateState({ newOffer: { ...state.newOffer, [name]: value } });
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (state.backendStatus === 'disconnected') {
      const id = state.offers.length + 1;
      updateState({ offers: [...state.offers, { ...state.newOffer, id }] });
      alert('DEMO: New offer added!');
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/offers`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state.newOffer),
        });
        if (response.ok) { alert('Offer added successfully!'); fetchOffers(); }
        else throw new Error('Failed to add offer');
      } catch{ alert('Failed to add offer'); }
    }
    updateState({ showAddOfferForm: false, newOffer: { title: '', discount: '', validTill: '', active: true } });
  };

  const handleApprovePayment = async (id) => {
    if (state.backendStatus === 'disconnected') {
      updateState({ payments: state.payments.map(p => p.id === id ? { ...p, status: 'completed' } : p) });
      alert(`DEMO: Payment ${id} approved`);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/${id}/approve`, { method: 'PUT' });
        if (response.ok) { alert(`Payment ${id} approved!`); fetchPayments(); }
      } catch { alert('Failed to approve payment'); }
    }
  };

  const handleRejectPayment = async (id) => {
    if (state.backendStatus === 'disconnected') {
      updateState({ payments: state.payments.map(p => p.id === id ? { ...p, status: 'rejected' } : p) });
      alert(`DEMO: Payment ${id} rejected`);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/${id}/reject`, { method: 'PUT' });
        if (response.ok) { alert(`Payment ${id} rejected!`); fetchPayments(); }
      } catch{ alert('Failed to reject payment'); }
    }
  };

  const handleRepair = async (type, vehicleId) => {
    if (state.backendStatus === 'disconnected') {
      updateState({ 
        vehicles: { 
          ...state.vehicles, 
          [type]: state.vehicles[type].map(v => v.id === Number(vehicleId) ? { ...v, damaged: false } : v) 
        } 
      });
      alert('DEMO: Vehicle marked as repaired!');
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/repair`, { method: 'PUT' });
        if (response.ok) { alert('Vehicle marked as repaired!'); fetchVehicles(); }
      } catch{ alert('Failed to mark vehicle as repaired'); }
    }
  };

  const handleAddDamage = async () => {
    if (!state.selectedVehicleId) return;
    if (state.backendStatus === 'disconnected') {
      updateState({ 
        vehicles: { 
          ...state.vehicles, 
          [state.selectedType]: state.vehicles[state.selectedType].map(v => 
            v.id === Number(state.selectedVehicleId) ? { ...v, damaged: true } : v
          ) 
        } 
      });
      alert('DEMO: Vehicle marked as damaged!');
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${state.selectedVehicleId}/damage`, { method: 'PUT' });
        if (response.ok) { alert('Vehicle marked as damaged!'); fetchVehicles(); }
      } catch{ alert('Failed to mark vehicle as damaged'); }
    }
    updateState({ showModal: false, selectedVehicleId: "" });
  };

  // Rental Management Functions
  const handleViewRentalDetails = (rental) => {
    updateState({ selectedRental: rental, showRentalModal: true });
  };

  const handleConfirmRental = async (rentalId) => {
    if (state.backendStatus === 'disconnected') {
      updateState({ 
        rentals: state.rentals.map(rental => 
          rental.id === rentalId ? { ...rental, status: 'confirmed' } : rental
        ) 
      });
      alert(`DEMO: Rental #${rentalId} confirmed!`);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/confirm`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) { 
          alert(`Rental #${rentalId} confirmed successfully!`); 
          fetchRentals(); 
        } else {
          throw new Error('Failed to confirm rental');
        }
      } catch{
        alert('Failed to confirm rental');
      }
    }
    updateState({ showRentalModal: false, selectedRental: null });
  };

  const handleRejectRental = async (rentalId) => {
    if (state.backendStatus === 'disconnected') {
      updateState({ 
        rentals: state.rentals.map(rental => 
          rental.id === rentalId ? { ...rental, status: 'rejected' } : rental
        ) 
      });
      alert(`DEMO: Rental #${rentalId} rejected!`);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/reject`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) { 
          alert(`Rental #${rentalId} rejected!`); 
          fetchRentals(); 
        } else {
          throw new Error('Failed to reject rental');
        }
      } catch{
        alert('Failed to reject rental');
      }
    }
    updateState({ showRentalModal: false, selectedRental: null });
  };

  const handleCompleteRental = async (rentalId) => {
    if (state.backendStatus === 'disconnected') {
      updateState({ 
        rentals: state.rentals.map(rental => 
          rental.id === rentalId ? { ...rental, status: 'completed' } : rental
        ) 
      });
      alert(`DEMO: Rental #${rentalId} marked as completed!`);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/complete`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) { 
          alert(`Rental #${rentalId} completed!`); 
          fetchRentals(); 
        } else {
          throw new Error('Failed to complete rental');
        }
      } catch {
        alert('Failed to complete rental');
      }
    }
  };

  const sendConfirmationEmail = (rental) => {
    // Simulate sending confirmation email
    const emailContent = `
      Dear ${rental.userName},

      Your vehicle rental has been confirmed!

      Booking Details:
      - Vehicle: ${rental.vehicleName} (${rental.vehicleType})
      - Rental Period: ${rental.startDate} to ${rental.endDate}
      - Total Cost: ₹${rental.totalCost}
      - Pickup Location: ${rental.pickupLocation}

      Thank you for choosing RentX!

      Best regards,
      RentX Team
    `;
    
    console.log('Sending confirmation email:', emailContent);
    alert(`Confirmation email sent to ${rental.userEmail}`);
  };

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

  // Render functions
  const renderOverview = () => {
    const { users, vehicles, payments,rentals, backendStatus, loading } = state;
    const stats = {
      totalUsers: users.length,
      totalCars: vehicles.cars.length,
      availableCars: vehicles.cars.filter(c => c.available && !c.damaged).length,
      damagedCars: vehicles.cars.filter(c => c.damaged).length,
      totalBikes: vehicles.bikes.length,
      availableBikes: vehicles.bikes.filter(b => b.available && !b.damaged).length,
      damagedBikes: vehicles.bikes.filter(b => b.damaged).length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      completedPayments: payments.filter(p => p.status === 'completed').length,
      pendingRentals: rentals.filter(r => r.status === 'pending').length,
      confirmedRentals: rentals.filter(r => r.status === 'confirmed').length,
      totalRentals: rentals.length
    };

    return (
      <div className="overview-dashboard">
        <div className="dashboard-header">
          <h2>Admin Dashboard Overview</h2>
          <div className={`backend-status ${backendStatus}`}>
            {backendStatus === 'connected' && '✅ Backend Connected'}
            {backendStatus === 'disconnected' && '⚠️ Demo Mode - Backend Not Connected'}
            {backendStatus === 'checking' && '🔍 Checking Backend...'}
          </div>
        </div>
        <p className="subtitle">Summary of users, vehicles, payments, damages, and offers</p>
        {loading && <div className="loading">Loading dashboard data...</div>}
        
        {/* Stats Cards with MainPage styling */}
        <div className="summary-cards">
          <div className="stat-card">
            <div className="stat-icon"><Users size={24} /></div>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Car size={24} /></div>
            <h3>{stats.totalCars}</h3>
            <p>Cars ({stats.availableCars} avail, {stats.damagedCars} damaged)</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Bike size={24} /></div>
            <h3>{stats.totalBikes}</h3>
            <p>Bikes ({stats.availableBikes} avail, {stats.damagedBikes} damaged)</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CreditCard size={24} /></div>
            <h3>{stats.pendingPayments}</h3>
            <p>Pending Payments</p>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon"><CreditCard size={24} /></div>
            <h3>{stats.completedPayments}</h3>
            <p>Completed Payments</p>
          </div>
          <div className="stat-card rental">
            <div className="stat-icon"><Calendar size={24} /></div>
            <h3>{stats.pendingRentals}</h3>
            <p>Pending Rentals</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons-grid">
            <button 
              className="action-btn primary" 
              onClick={() => updateState({ activeTab: 'rentals' })}
            >
              <Calendar size={20} />
              Manage Rentals ({stats.pendingRentals} pending)
            </button>
            <button 
              className="action-btn warning" 
              onClick={() => updateState({ activeTab: 'damages' })}
            >
              <AlertTriangle size={20} />
              View Damages ({stats.damagedCars + stats.damagedBikes})
            </button>
            <button 
              className="action-btn info" 
              onClick={() => updateState({ activeTab: 'payments' })}
            >
              <CreditCard size={20} />
              Process Payments ({stats.pendingPayments})
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

        {backendStatus === 'disconnected' && (
          <div className="demo-notice">
            <Shield size={16} />
            <span>Demo Mode - Using sample data. Start Spring Boot for real data.</span>
          </div>
        )}
      </div>
    );
  };

  const renderUserDetails = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>User Management</h2>
        <p>Manage all registered users in the system</p>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Total Bookings</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className="user-info">
                    <User size={16} />
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.joinDate}</td>
                <td>{user.totalBookings}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-warning">Suspend</button>
                    <button className="btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.users.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderVehicles = () => {
    const allVehicles = [...state.vehicles.cars, ...state.vehicles.bikes];
    return (
      <div className="tab-content">
        <div className="tab-header">
          <h2>Vehicle Management</h2>
          <p>Manage all vehicles in the fleet</p>
          <button 
            className="btn-primary" 
            onClick={() => updateState({ showAddVehicleForm: true })}
          >
            <Plus size={16} />Add Vehicle
          </button>
        </div>
        
        {state.showAddVehicleForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Add New Vehicle</h3>
                <button 
                  onClick={() => updateState({ showAddVehicleForm: false })} 
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmitVehicle} className="form">
                {['type', 'name', 'model', 'number', 'rentCost', 'available'].map(field => (
                  <div key={field} className="form-group">
                    <label>
                      {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    {field === 'type' || field === 'available' ? (
                      <select 
                        name={field} 
                        value={state.newVehicle[field]} 
                        onChange={handleVehicleInputChange}
                      >
                        {field === 'type' 
                          ? [['car', 'Car'], ['bike', 'Bike']]
                          : [['true', 'Available'], ['false', 'Not Available']].map(([val, text]) => (
                            <option key={val} value={val}>{text}</option>
                          ))
                        }
                      </select>
                    ) : (
                      <input 
                        type={field === 'rentCost' ? 'number' : 'text'} 
                        name={field} 
                        value={state.newVehicle[field]} 
                        onChange={handleVehicleInputChange} 
                        required 
                      />
                    )}
                  </div>
                ))}
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => updateState({ showAddVehicleForm: false })} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Name</th>
                <th>Model</th>
                <th>Number</th>
                <th>Rent Cost</th>
                <th>Status</th>
                <th>Damage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allVehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>{vehicle.id}</td>
                  <td>
                    <span className={`type-badge ${vehicle.type.toLowerCase()}`}>
                      {vehicle.type === 'CAR' ? <Car size={14} /> : <Bike size={14} />}
                      {vehicle.type}
                    </span>
                  </td>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.number}</td>
                  <td>₹{vehicle.rentCost}/day</td>
                  <td>
                    <span className={`status-badge ${vehicle.available ? 'available' : 'unavailable'}`}>
                      {vehicle.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <span className={`damage-badge ${vehicle.damaged ? 'damaged' : 'ok'}`}>
                      {vehicle.damaged ? 'Damaged' : 'OK'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-secondary" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="btn-danger" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allVehicles.length === 0 && (
            <div className="empty-state">
              <Car size={48} />
              <p>No vehicles found</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDamages = () => {
    const damagedVehicles = [...state.vehicles.cars, ...state.vehicles.bikes].filter(v => v.damaged);
    return (
      <div className="tab-content">
        <div className="tab-header">
          <h2>Damage Reports</h2>
          <p>Manage vehicle damages and repairs</p>
          <div className="header-actions">
            <button 
              className="btn-warning" 
              onClick={() => updateState({ showModal: true })}
            >
              <AlertTriangle size={16} />Report Damage
            </button>
          </div>
        </div>
        
        {state.showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Report Vehicle Damage</h3>
                <button 
                  onClick={() => updateState({ showModal: false })} 
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="form">
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select 
                    value={state.selectedType} 
                    onChange={(e) => updateState({ selectedType: e.target.value })}
                  >
                    <option value="cars">Cars</option>
                    <option value="bikes">Bikes</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Select Vehicle</label>
                  <select 
                    value={state.selectedVehicleId} 
                    onChange={(e) => updateState({ selectedVehicleId: e.target.value })}
                  >
                    <option value="">Select a vehicle</option>
                    {state.vehicles[state.selectedType].filter(v => !v.damaged).map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} - {vehicle.number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => updateState({ showModal: false })} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleAddDamage} 
                    className="btn-warning" 
                    disabled={!state.selectedVehicleId}
                  >
                    Mark as Damaged
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Name</th>
                <th>Model</th>
                <th>Number</th>
                <th>Rent Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {damagedVehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>{vehicle.id}</td>
                  <td>
                    <span className={`type-badge ${vehicle.type.toLowerCase()}`}>
                      {vehicle.type === 'CAR' ? <Car size={14} /> : <Bike size={14} />}
                      {vehicle.type}
                    </span>
                  </td>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.number}</td>
                  <td>₹{vehicle.rentCost}/day</td>
                  <td>
                    <span className="damage-badge damaged">
                      <AlertTriangle size={14} />Damaged
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-success" 
                        onClick={() => handleRepair(vehicle.type === 'CAR' ? 'cars' : 'bikes', vehicle.id)} 
                        title="Mark as Repaired"
                      >
                        <Wrench size={14} />Repair
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {damagedVehicles.length === 0 && (
            <div className="empty-state">
              <Check size={48} />
              <p>No damaged vehicles found</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPayments = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Payment Management</h2>
        <p>Approve or reject pending payments</p>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.user}</td>
                <td>₹{payment.amount}</td>
                <td>{payment.date}</td>
                <td>
                  <span className={`status-badge ${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {payment.status === 'pending' && (
                      <>
                        <button 
                          className="btn-success" 
                          onClick={() => handleApprovePayment(payment.id)}
                        >
                          <Check size={14} />Approve
                        </button>
                        <button 
                          className="btn-danger" 
                          onClick={() => handleRejectPayment(payment.id)}
                        >
                          <X size={14} />Reject
                        </button>
                      </>
                    )}
                    {payment.status === 'completed' && (
                      <span className="completed-text">Completed</span>
                    )}
                    {payment.status === 'rejected' && (
                      <span className="rejected-text">Rejected</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {state.payments.length === 0 && (
          <div className="empty-state">
            <CreditCard size={48} />
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Offer Management</h2>
        <p>Create and manage special offers</p>
        <button 
          className="btn-primary" 
          onClick={() => updateState({ showAddOfferForm: true })}
        >
          <Plus size={16} />Add Offer
        </button>
      </div>
      
      {state.showAddOfferForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Offer</h3>
              <button 
                onClick={() => updateState({ showAddOfferForm: false })} 
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitOffer} className="form">
              {['title', 'discount', 'validTill', 'active'].map(field => (
                <div key={field} className="form-group">
                  <label>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  {field === 'active' ? (
                    <select 
                      name={field} 
                      value={state.newOffer[field]} 
                      onChange={handleOfferInputChange}
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  ) : (
                    <input 
                      type={field === 'validTill' ? 'date' : 'text'} 
                      name={field} 
                      value={state.newOffer[field]} 
                      onChange={handleOfferInputChange} 
                      required 
                      placeholder={field === 'discount' ? "e.g., 15% or ₹500" : ""} 
                    />
                  )}
                </div>
              ))}
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => updateState({ showAddOfferForm: false })} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="offers-grid">
        {state.offers.map(offer => (
          <div key={offer.id} className={`offer-card ${offer.active ? 'active' : 'inactive'}`}>
            <div className="offer-header">
              <Gift size={20} />
              <h3>{offer.title}</h3>
              <span className={`offer-status ${offer.active ? 'active' : 'inactive'}`}>
                {offer.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="offer-details">
              <div className="offer-discount">{offer.discount}</div>
              <div className="offer-validity">Valid till: {offer.validTill}</div>
            </div>
            <div className="offer-actions">
              <button className="btn-secondary">
                <Edit size={14} />Edit
              </button>
              <button className="btn-danger">
                <Trash2 size={14} />Delete
              </button>
            </div>
          </div>
        ))}
        {state.offers.length === 0 && (
          <div className="empty-state">
            <Gift size={48} />
            <p>No offers found</p>
          </div>
        )}
      </div>
    </div>
  );
  const renderRentals = () => {
    const { rentals } = state;
    const pendingRentals = rentals.filter(r => r.status === 'pending');
    const confirmedRentals = rentals.filter(r => r.status === 'confirmed');
    const completedRentals = rentals.filter(r => r.status === 'completed');

    return (
      <div className="tab-content">
        <div className="tab-header">
          <h2>Rental Management</h2>
          <p>Confirm, reject, and manage vehicle rentals</p>
        </div>

        {/* Rental Tabs */}
        <div className="rental-tabs">
          <div className="tab-buttons">
            <button 
              className={state.activeRentalTab === 'pending' ? 'active' : ''}
              onClick={() => updateState({ activeRentalTab: 'pending' })}
            >
              Pending ({pendingRentals.length})
            </button>
            <button 
              className={state.activeRentalTab === 'confirmed' ? 'active' : ''}
              onClick={() => updateState({ activeRentalTab: 'confirmed' })}
            >
              Confirmed ({confirmedRentals.length})
            </button>
            <button 
              className={state.activeRentalTab === 'completed' ? 'active' : ''}
              onClick={() => updateState({ activeRentalTab: 'completed' })}
            >
              Completed ({completedRentals.length})
            </button>
          </div>

          <div className="rental-content">
            {(state.activeRentalTab === 'pending' || !state.activeRentalTab) && (
              <div className="rental-section">
                <h3>Pending Rentals</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Vehicle</th>
                        <th>Rental Period</th>
                        <th>Total Cost</th>
                        <th>Pickup Location</th>
                        <th>Booking Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRentals.map(rental => (
                        <tr key={rental.id}>
                          <td>#{rental.id}</td>
                          <td>
                            <div className="user-info">
                              <User size={16} />
                              <div>
                                <strong>{rental.userName}</strong>
                                <br />
                                <small>{rental.userEmail}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="vehicle-info">
                              {rental.vehicleType === 'CAR' ? <Car size={16} /> : <Bike size={16} />}
                              {rental.vehicleName}
                            </div>
                          </td>
                          <td>
                            {rental.startDate} to {rental.endDate}
                          </td>
                          <td>₹{rental.totalCost}</td>
                          <td>{rental.pickupLocation}</td>
                          <td>{rental.bookingDate}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-success" 
                                onClick={() => handleViewRentalDetails(rental)}
                              >
                                <Check size={14} /> Details
                              </button>
                              <button 
                                className="btn-primary" 
                                onClick={() => handleConfirmRental(rental.id)}
                              >
                                Confirm
                              </button>
                              <button 
                                className="btn-danger" 
                                onClick={() => handleRejectRental(rental.id)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pendingRentals.length === 0 && (
                    <div className="empty-state">
                      <Check size={48} />
                      <p>No pending rentals</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {state.activeRentalTab === 'confirmed' && (
              <div className="rental-section">
                <h3>Confirmed Rentals</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Vehicle</th>
                        <th>Rental Period</th>
                        <th>Total Cost</th>
                        <th>Pickup Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {confirmedRentals.map(rental => (
                        <tr key={rental.id}>
                          <td>#{rental.id}</td>
                          <td>
                            <div className="user-info">
                              <User size={16} />
                              {rental.userName}
                            </div>
                          </td>
                          <td>
                            <div className="vehicle-info">
                              {rental.vehicleType === 'CAR' ? <Car size={16} /> : <Bike size={16} />}
                              {rental.vehicleName}
                            </div>
                          </td>
                          <td>
                            {rental.startDate} to {rental.endDate}
                          </td>
                          <td>₹{rental.totalCost}</td>
                          <td>{rental.pickupLocation}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-success" 
                                onClick={() => handleCompleteRental(rental.id)}
                              >
                                Mark Complete
                              </button>
                              <button 
                                className="btn-secondary" 
                                onClick={() => sendConfirmationEmail(rental)}
                              >
                                <Mail size={14} /> Email
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {confirmedRentals.length === 0 && (
                    <div className="empty-state">
                      <Calendar size={48} />
                      <p>No confirmed rentals</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {state.activeRentalTab === 'completed' && (
              <div className="rental-section">
                <h3>Completed Rentals</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Vehicle</th>
                        <th>Rental Period</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedRentals.map(rental => (
                        <tr key={rental.id}>
                          <td>#{rental.id}</td>
                          <td>{rental.userName}</td>
                          <td>
                            <div className="vehicle-info">
                              {rental.vehicleType === 'CAR' ? <Car size={16} /> : <Bike size={16} />}
                              {rental.vehicleName}
                            </div>
                          </td>
                          <td>
                            {rental.startDate} to {rental.endDate}
                          </td>
                          <td>₹{rental.totalCost}</td>
                          <td>
                            <span className="status-badge completed">Completed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {completedRentals.length === 0 && (
                    <div className="empty-state">
                      <Check size={48} />
                      <p>No completed rentals</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rental Details Modal */}
        {state.showRentalModal && state.selectedRental && (
          <div className="modal-overlay">
            <div className="modal large">
              <div className="modal-header">
                <h3>Rental Details - #{state.selectedRental.id}</h3>
                <button 
                  onClick={() => updateState({ showRentalModal: false, selectedRental: null })} 
                  className="close-btn"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="rental-details-grid">
                  <div className="detail-section">
                    <h4>User Information</h4>
                    <div className="detail-item">
                      <User size={16} />
                      <strong>Name:</strong> {state.selectedRental.userName}
                    </div>
                    <div className="detail-item">
                      <Mail size={16} />
                      <strong>Email:</strong> {state.selectedRental.userEmail}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Vehicle Information</h4>
                    <div className="detail-item">
                      {state.selectedRental.vehicleType === 'CAR' ? <Car size={16} /> : <Bike size={16} />}
                      <strong>Vehicle:</strong> {state.selectedRental.vehicleName}
                    </div>
                    <div className="detail-item">
                      <strong>Type:</strong> {state.selectedRental.vehicleType}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Rental Details</h4>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <strong>Start Date:</strong> {state.selectedRental.startDate}
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <strong>End Date:</strong> {state.selectedRental.endDate}
                    </div>
                    <div className="detail-item">
                      <CreditCard size={16} />
                      <strong>Total Cost:</strong> ₹{state.selectedRental.totalCost}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Location & Status</h4>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <strong>Pickup:</strong> {state.selectedRental.pickupLocation}
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong> 
                      <span className={`status-badge ${state.selectedRental.status}`}>
                        {state.selectedRental.status}
                      </span>
                    </div>
                  </div>
                </div>

                {state.selectedRental.status === 'pending' && (
                  <div className="modal-actions">
                    <button 
                      className="btn-success" 
                      onClick={() => handleConfirmRental(state.selectedRental.id)}
                    >
                      <Check size={16} /> Confirm Rental
                    </button>
                    <button 
                      className="btn-danger" 
                      onClick={() => handleRejectRental(state.selectedRental.id)}
                    >
                      <X size={16} /> Reject Rental
                    </button>
                    <button 
                      className="btn-secondary" 
                      onClick={() => updateState({ showRentalModal: false, selectedRental: null })}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (state.loading && state.activeTab === 'overview') return (
      <div className="loading-fullscreen">
        <RefreshCw className="spinner" />
        <p>Loading dashboard data...</p>
      </div>
    );
    
    const renderers = { 
      overview: renderOverview, 
      users: renderUserDetails, 
      vehicles: renderVehicles, 
      damages: renderDamages, 
      payments: renderPayments, 
      offers: renderOffers,
      rentals: renderRentals
    };
    
    return renderers[state.activeTab] ? renderers[state.activeTab]() : renderOverview();
  };

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text">RentX Admin</span>
        </div>
        <ul className="nav-links">
          {['overview', 'rentals', 'users', 'vehicles', 'damages', 'payments', 'offers'].map(tab => (
            <li key={tab}>
              <button 
                onClick={() => updateState({ activeTab: tab })} 
                className={state.activeTab === tab ? 'active' : ''}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <button 
            className="refresh-button" 
            onClick={loadDashboardData} 
            disabled={state.loading}
          >
            <RefreshCw size={16} />Refresh
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut /> Logout
          </button>
        </div>
      </nav>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;  