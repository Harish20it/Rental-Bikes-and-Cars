import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Car, 
  Bike, 
  Shield, 
  User, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Award,
  Users,
  TrendingUp,
  ChevronDown,
  LogOut,
  Calendar,
  MapPin as LocationIcon,
  Check,
  MessageCircle,
  Heart,
  ThumbsUp,
  Zap,
  CreditCard,
  Calendar as CalendarIcon
} from "lucide-react";
import "./styles/MainPage.css";

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [rentalForm, setRentalForm] = useState({
    vehicleType: "",
    startDate: "",
    endDate: "",
    location: ""
  });
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fixed useEffect with proper dependency array
  useEffect(() => {
    // Check if user is logged in
    const checkAuthentication = () => {
      const userToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (userToken && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthentication();

    // Add scroll listener for active section highlighting
    const handleScroll = () => {
      const sections = ['home', 'features', 'vehicles', 'about', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array = run only once on mount

  // User authentication functions
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setShowDropdown(false);
    navigate('/');
  };

  const handleDashboard = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
    setShowDropdown(false);
  };

  // Contact form handling
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Contact form submitted:", contactForm);
      alert("Thank you for your message! We'll get back to you soon.");
      
      // Reset form
      setContactForm({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rental functions - UPDATED WITH AUTHENTICATION CHECK
  const handleRentCar = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (userData.role === 'ADMIN') {
      navigate('/admin-dashboard?tab=vehicles');
    } else {
      setRentalForm(prev => ({ ...prev, vehicleType: 'car' }));
      setShowRentalModal(true);
    }
  };

  const handleRentBike = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (userData.role === 'ADMIN') {
      navigate('/admin-dashboard?tab=vehicles');
    } else {
      setRentalForm(prev => ({ ...prev, vehicleType: 'bike' }));
      setShowRentalModal(true);
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    
    // Double check authentication before submitting
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      // Simulate API call for rental booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Rental booking submitted:", rentalForm);
      alert(`Your ${rentalForm.vehicleType} rental has been booked successfully!`);
      
      // Reset form and close modal
      setRentalForm({
        vehicleType: "",
        startDate: "",
        endDate: "",
        location: ""
      });
      setShowRentalModal(false);
      
      // Navigate to user dashboard
      navigate('/user-dashboard');
    } catch (error) {
      console.error("Error booking rental:", error);
      alert("There was an error processing your booking. Please try again.");
    }
  };

  const handleRentalChange = (e) => {
    const { name, value } = e.target;
    setRentalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update the handleVehicleCategory function with authentication
  const handleVehicleCategory = (category) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (userData.role === 'ADMIN') {
      navigate('/admin-dashboard', { 
        state: { 
          activeTab: 'vehicles'
        }
      });
    } else {
      // Navigate to UserDashboard with vehicles tab active and proper filter
      navigate('/user-dashboard', { 
        state: { 
          activeTab: 'vehicles',
          vehicleFilter: category === 'cars' ? 'cars' : 'bikes'
        }
      });
    }
  };

  const handleCallSupport = () => {
    window.open('tel:+919876543210');
  };

  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@rentx.com';
  };

  const handleGetDirections = () => {
    const address = "123 Rental Street, Bengalore, Karnataka";
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  // Social media handlers
  const handleSocialMedia = (platform) => {
    const socialUrls = {
      facebook: "https://facebook.com/rentx",
      twitter: "https://twitter.com/rentx",
      instagram: "https://instagram.com/rentx",
      linkedin: "https://linkedin.com/company/rentx"
    };
    
    window.open(socialUrls[platform], '_blank');
  };

  // Policy links
  const handlePolicyLink = (policy) => {
    const policyRoutes = {
      privacy: "/privacy-policy",
      terms: "/terms-of-service",
      cookie: "/cookie-policy"
    };
    
    navigate(policyRoutes[policy]);
  };

  // Smooth scroll to sections
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  const vehicleTypes = [
    {
      icon: <Car size={48} />,
      type: "Cars",
      count: "50+ Vehicles",
      description: "From economy to luxury cars",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      popular: true
    },
    {
      icon: <Bike size={48} />,
      type: "Bikes",
      count: "30+ Vehicles",
      description: "Scooters to sports bikes",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      popular: false
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy Customers", icon: <Heart size={24} /> },
    { value: "80+", label: "Vehicles", icon: <Car size={24} /> },
    { value: "50+", label: "Locations", icon: <MapPin size={24} /> },
    { value: "24/7", label: "Support", icon: <Phone size={24} /> }
  ];

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="main-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page">
      {/* Rental Modal */}
      {showRentalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Book Your {rentalForm.vehicleType === 'car' ? 'Car' : 'Bike'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRentalModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRentalSubmit} className="rental-form">
              <div className="form-group">
                <label>
                  <CalendarIcon size={16} />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={rentalForm.startDate}
                  onChange={handleRentalChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>
                  <CalendarIcon size={16} />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={rentalForm.endDate}
                  onChange={handleRentalChange}
                  required
                  min={rentalForm.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>
                  <LocationIcon size={16} />
                  Pickup Location
                </label>
                <select
                  name="location"
                  value={rentalForm.location}
                  onChange={handleRentalChange}
                  required
                >
                  <option value="">Select location</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="chennai">Chennai</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowRentalModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CreditCard size={16} />
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">RentX</span>
          </div>
          
          <ul className="nav-links">
            {['home', 'features', 'vehicles', 'about', 'contact'].map((section) => (
              <li key={section}>
                <a 
                  href={`#${section}`} 
                  onClick={(e) => handleNavClick(e, section)}
                  className={activeSection === section ? 'active' : ''}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-buttons">
            {isAuthenticated && user ? (
              <div className="user-menu">
                <button 
                  className="user-profile-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="user-avatar">
                    {user.role === 'ADMIN' ? <Shield size={18} /> : <User size={18} />}
                  </div>
                  <span className="user-name">
                    {user.name}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                {showDropdown && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <strong>{user.name}</strong>
                      <span className={`user-role ${user.role.toLowerCase()}`}>
                        {user.role === 'ADMIN' ? <Shield size={14} /> : <User size={14} />}
                        {user.role}
                      </span>
                    </div>
                    <button onClick={handleDashboard} className="dropdown-item">
                      {user.role === 'ADMIN' ? <Shield size={16} /> : <User size={16} />}
                      Dashboard
                    </button>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Home Section */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="hero-bg-shape shape-1"></div>
          <div className="hero-bg-shape shape-2"></div>
          <div className="hero-bg-shape shape-3"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Star size={16} fill="currentColor" />
              Trusted by 10,000+ Customers
            </div>
            
            <h1 className="hero-title">
              Find Your Perfect <span className="highlight">Ride</span>
            </h1>
            
            <h2 className="hero-subtitle">
              Looking for a Vehicle?<br />
              You're in the <span className="highlight">Right Place</span>.
            </h2>
            
            <p className="hero-description">
              RentX offers the best vehicle rental experience with premium quality, 
              affordable prices, and exceptional customer service. Choose from our 
              wide range of well-maintained cars and bikes for your next journey.
            </p>

            <div className="hero-features">
              <span><Check size={16} /> High quality at low cost</span>
              <span><Check size={16} /> Premium services</span>
              <span><Check size={16} /> 24/7 roadside support</span>
              <span><Check size={16} /> Instant booking confirmation</span>
            </div>
            
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={`stat-${index}`} className="stat-preview">
                  <div className="stat-icon">{stat.icon}</div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="illustration-container">
                <div className="floating-vehicle car">
                  <Car size={64} />
                </div>
                <div className="floating-vehicle bike">
                  <Bike size={64} />
                </div>
                <div className="hero-graphics">
                  <div className="graphic-circle circle-1"></div>
                  <div className="graphic-circle circle-2"></div>
                  <div className="graphic-circle circle-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose RentX?</h2>
            <p>Experience the best vehicle rental service with our premium features</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Vehicles Section */}
      <section id="vehicles" className="vehicles">
        <div className="container">
          <div className="section-header">
            <h2>Our Vehicle Collection</h2>
            <p>Choose from our wide range of well-maintained vehicles</p>
          </div>
          <div className="vehicles-grid">
            {vehicleTypes.map((vehicle, index) => (
              <div 
                key={`vehicle-${index}`} 
                className="vehicle-type-card"
                style={{ background: vehicle.gradient }}
                onClick={() => handleVehicleCategory(vehicle.type.toLowerCase())}
              >
                {vehicle.popular && <div className="popular-tag">Popular</div>}
                <div className="vehicle-icon">
                  {vehicle.icon}
                </div>
                <h3>{vehicle.type}</h3>
                <p className="vehicle-count">{vehicle.count}</p>
                <p className="vehicle-desc">{vehicle.description}</p>
                <span className="explore-link">
                  {isAuthenticated && user?.role === 'ADMIN' ? 'Manage' : 'Book'} {vehicle.type} 
                  <ChevronDown size={16} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <div className="section-header">
                <h2>About RentX</h2>
                <p>Your trusted partner in vehicle rentals</p>
              </div>
              <p>
                Welcome to RentX, your trusted partner for renting cars and bikes. 
                Whether you need a stylish car for your city trips or a bike for your 
                daily rides, we've got you covered.
              </p>
              <p>
                Our mission is to provide affordable, premium quality vehicles with 
                excellent customer support and flexible rental options. We ensure every 
                vehicle is well maintained and ready for your journey.
              </p>
              <div className="about-features">
                <span><Star size={16} /> Quality Assured</span>
                <span><Shield size={16} /> Secure Booking</span>
                <span><Users size={16} /> Customer First</span>
                <span><Zap size={16} /> Instant Support</span>
              </div>
            </div>
            <div className="about-visual">
              <div className="floating-card card-1" onClick={handleRentCar}>
                <Car size={24} />
                <span>{isAuthenticated && user?.role === 'ADMIN' ? 'Manage Cars' : 'Car Rentals'}</span>
              </div>
              <div className="floating-card card-2" onClick={handleRentBike}>
                <Bike size={24} />
                <span>{isAuthenticated && user?.role === 'ADMIN' ? 'Manage Bikes' : 'Bike Rentals'}</span>
              </div>
              <div className="floating-card card-3">
                <ThumbsUp size={24} />
                <span>5-Star Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Have questions? We're here to help</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item" onClick={handleCallSupport}>
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 98765 43210</p>
                  <span className="contact-subtext">Available 24/7</span>
                </div>
              </div>
              <div className="contact-item" onClick={handleEmailSupport}>
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@rentx.com</p>
                  <span className="contact-subtext">We reply within 2 hours</span>
                </div>
              </div>
              <div className="contact-item" onClick={handleGetDirections}>
                <div className="contact-icon">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4>Visit Us</h4>
                  <p>123 Rental Street, City</p>
                  <span className="contact-subtext">Get directions</span>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message"
                    placeholder="Your Message" 
                    rows="4" 
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-icon">🚗</span>
                <span className="logo-text">RentX</span>
              </div>
              <p>Your perfect destination for cars and bikes at the best prices with premium service.</p>
              <div className="social-links">
                <button onClick={() => handleSocialMedia('facebook')} aria-label="Facebook">
                  <span>📘</span>
                </button>
                <button onClick={() => handleSocialMedia('twitter')} aria-label="Twitter">
                  <span>🐦</span>
                </button>
                <button onClick={() => handleSocialMedia('instagram')} aria-label="Instagram">
                  <span>📷</span>
                </button>
                <button onClick={() => handleSocialMedia('linkedin')} aria-label="LinkedIn">
                  <span>💼</span>
                </button>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                {['home', 'about', 'features', 'vehicles', 'contact'].map((section) => (
                  <li key={section}>
                    <a 
                      href={`#${section}`} 
                      onClick={(e) => handleNavClick(e, section)}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Vehicles</h4>
              <ul>
                <li>
                  <a 
                    href="#cars" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleRentCar();
                    }}
                  >
                    Cars
                  </a>
                </li>
                <li>
                  <a 
                    href="#bikes" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleRentBike();
                    }}
                  >
                    Bikes
                  </a>
                </li>
                <li><Link to="/vehicles">All Vehicles</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Info</h4>
              <div>
                <p><Phone size={16} /> +91 98765 43210</p>
                <p><Mail size={16} /> support@rentx.com</p>
                <p><MapPin size={16} /> 123 Rental Street</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} RentX. All rights reserved.</p>
            <div className="footer-links">
              <button onClick={() => handlePolicyLink('privacy')}>Privacy Policy</button>
              <button onClick={() => handlePolicyLink('terms')}>Terms of Service</button>
              <button onClick={() => handlePolicyLink('cookie')}>Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;