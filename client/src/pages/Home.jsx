import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, X, Calendar } from 'lucide-react';
import './Home.css';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Booking modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');

    // Availability state
    const [availability, setAvailability] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { data } = await axios.get('/api/properties');
                setProperties(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
    );

    const handleBookNow = (property) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedProperty(property);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(tomorrow.toISOString().split('T')[0]);
        setShowModal(true);
        setBookingError('');
        setAvailability(null);
    };

    const checkAvailability = async (propertyId, start, end) => {
        if (!propertyId || !start || !end) return;
        setCheckingAvailability(true);
        try {
            const { data } = await axios.get(`/api/properties/${propertyId}/availability`, {
                params: { startDate: start, endDate: end }
            });
            setAvailability(data.available);
            if (!data.available) {
                setBookingError('Property not available for selected dates');
            } else {
                setBookingError('');
            }
        } catch (err) {
            console.error(err);
            setAvailability(false);
            setBookingError('Could not check availability');
        } finally {
            setCheckingAvailability(false);
        }
    };

    useEffect(() => {
        if (selectedProperty && startDate && endDate) {
            checkAvailability(selectedProperty._id, startDate, endDate);
        }
    }, [startDate, endDate, selectedProperty]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            setBookingError('Please select both dates');
            return;
        }
        if (new Date(startDate) >= new Date(endDate)) {
            setBookingError('End date must be after start date');
            return;
        }
        if (availability === false) {
            setBookingError('Property not available for selected dates');
            return;
        }
        if (checkingAvailability) {
            setBookingError('Please wait, checking availability...');
            return;
        }

        setBookingLoading(true);
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            const totalPrice = selectedProperty.price * days;

            await axios.post('/api/bookings', {
                propertyId: selectedProperty._id, // ✅ use _id
                startDate,
                endDate,
                totalPrice
            });

            alert('Booking successful!');
            setShowModal(false);
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="home-page fade-in">
            <header className="hero">
                <div className="container hero-content">
                    <h1>Find Your Next <span className="highlight">Dream Home</span></h1>
                    <p>Discover the best rental properties in your city with premium amenities.</p>

                    <div className="search-bar glass-card">
                        <div className="search-input">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search by title or location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary">Find Houses</button>
                    </div>
                </div>
            </header>

            <section className="container properties-section">
                <div className="section-header">
                    <h2>Latest Properties</h2>
                    <div className="filter-badge">
                        <Filter size={16} /> Filters
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading properties...</div>
                ) : (
                    <div className="grid-auto">
                        {filteredProperties.map(property => (
                            <div key={property._id} className="property-card glass-card">
                                <div className="property-image">
                                    <img src={property.images[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=400'} alt={property.title} />
                                    <span className="type-badge">{property.type}</span>
                                </div>
                                <div className="property-info">
                                    <h3>{property.title}</h3>
                                    <p className="location"><MapPin size={16} /> {property.location}</p>
                                    <div className="property-footer">
                                        <span className="price">₹{property.price}<span>/day</span></span>
                                        <div className="property-actions">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleBookNow(property)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Booking Modal */}
            {showModal && selectedProperty && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <X size={20} />
                        </button>
                        <h3>Book {selectedProperty.title}</h3>
                        <p className="location"><MapPin size={16} /> {selectedProperty.location}</p>
                        <p className="price">₹{selectedProperty.price}<span>/day</span></p>

                        <form onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label><Calendar size={18} /> Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label><Calendar size={18} /> End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    required
                                />
                            </div>

                            {checkingAvailability && <div className="info-msg">Checking availability...</div>}
                            {availability === true && <div className="success-msg">✓ Property available for selected dates</div>}
                            {availability === false && <div className="error-msg">✗ Property not available for selected dates</div>}
                            {bookingError && availability !== false && <div className="error-msg">{bookingError}</div>}

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={bookingLoading || checkingAvailability || availability === false}
                            >
                                {bookingLoading ? 'Processing...' : checkingAvailability ? 'Checking...' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;