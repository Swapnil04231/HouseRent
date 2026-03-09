import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book, Calendar, Home as HomeIcon, CheckCircle, Clock, XCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (user.role === 'admin') {
                const [propData, bookData] = await Promise.all([
                    axios.get('/api/properties'),
                    axios.get('/api/bookings')
                ]);
                setProperties(propData.data);
                setBookings(bookData.data);
            } else {
                const { data } = await axios.get('/api/bookings/my-bookings');
                setBookings(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        setUpdating(true);
        try {
            await axios.put(`/api/bookings/${bookingId}`, { status: newStatus });
            await fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update booking');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="dashboard-container container fade-in">
            <header className="dashboard-header">
                <h1>{user.role === 'admin' ? 'Admin Panel' : 'My Account'}</h1>
                <p>Welcome back, {user.name}! Manage your {user.role === 'admin' ? 'listings and bookings' : 'rentals'} here.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <Book className="stat-icon" />
                    <div>
                        <h4>Total Bookings</h4>
                        <span className="stat-value">{bookings.length}</span>
                    </div>
                </div>
                {user.role === 'admin' && (
                    <div className="stat-card glass-card">
                        <HomeIcon className="stat-icon" />
                        <div>
                            <h4>Properties Listed</h4>
                            <span className="stat-value">{properties.length}</span>
                        </div>
                    </div>
                )}
            </div>

            <section className="dashboard-content">
                <div className="content-header">
                    <h3>{user.role === 'admin' ? 'All Bookings' : 'My Bookings'}</h3>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : bookings.length === 0 ? (
                    <div className="no-data glass-card">
                        <Clock size={48} />
                        <p>No bookings found yet.</p>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map(booking => (
                            <div key={booking._id} className="booking-item glass-card">
                                <div className="booking-info">
                                    <h4>{booking.propertyId?.title || 'Property'}</h4>
                                    <p>
                                        <Calendar size={14} />
                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                    </p>
                                    {user.role === 'admin' && booking.userId && (
                                        <p className="booking-user">
                                            <strong>Booked by:</strong> {booking.userId.name} ({booking.userId.email})
                                        </p>
                                    )}
                                </div>
                                <div className="booking-status">
                                    <span className={`status-badge ${booking.status}`}>
                                        {booking.status === 'confirmed' && <CheckCircle size={14} />}
                                        {booking.status === 'cancelled' && <XCircle size={14} />}
                                        {booking.status === 'pending' && <Clock size={14} />}
                                        {booking.status}
                                    </span>
                                    <span className="booking-price">₹{booking.totalPrice}</span>

                                    {user.role === 'admin' && booking.status === 'pending' && (
                                        <div className="booking-actions">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                disabled={updating}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                disabled={updating}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;