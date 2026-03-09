import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, User, PlusCircle, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass-card">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <Home className="logo-icon" />
                    <span>HouseRent</span>
                </Link>

                <div className="nav-links">
                    <Link to="/about" className="nav-item">About Us</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-item">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/add-property" className="nav-item">
                                    <PlusCircle size={18} /> Add Property
                                </Link>
                            )}
                            <div className="user-menu">
                                <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="btn-logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-btns">
                            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
