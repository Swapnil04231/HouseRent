import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Image, MapPin, IndianRupee, List, Home as HomeIcon } from 'lucide-react';
import './AddProperty.css';

const AddProperty = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        images: [''] // URL string array
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/properties', {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms)
            });
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-property-container container fade-in">
            <div className="form-wrapper glass-card">
                <h2>List Your Property</h2>
                <p>Fill in the details to reach thousands of renters.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full">
                            <label><HomeIcon size={18} /> Property Title</label>
                            <input
                                type="text"
                                placeholder="Modern 3-Bedroom Villa with Pool"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><IndianRupee size={18} /> Rent Price (₹/day)</label>
                            <input
                                type="number"
                                placeholder="ex 1000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><MapPin size={18} /> Location</label>
                            <input
                                type="text"
                                placeholder="ex Mumbai"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><List size={18} /> Property Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="villa">Villa</option>
                                <option value="studio">Studio</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Bedrooms</label>
                            <input
                                type="number"
                                value={formData.bedrooms}
                                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                            />
                        </div>

                        <div className="form-group full">
                            <label>Description</label>
                            <textarea
                                rows="4"
                                placeholder="Write about the house, neighborhood, and amenities..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group full">
                            <label><Image size={18} /> Image URL</label>
                            <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                value={formData.images[0]}
                                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary btn-submit">
                        {loading ? 'Adding...' : <><Plus size={20} /> Add Property</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;
