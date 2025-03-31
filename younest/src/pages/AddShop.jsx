import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosService from '../helpers/axios';

const AddShop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log("here is the user",user);
  const [formData, setFormData] = useState({
    owner :user?.id,
    name: '',
    location: '',
    contact: '',
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);  // State for image preview

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    // Handle image preview
    if (name === "logo" && files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result); // Set preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    for (let key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    try {
      setLoading(true);
      setError(null);
      
      // Send the request to create the shop
      const response = await axiosService.post('/shops/', data);
      
      // Redirect to the newly created shop page
      const shopId = response.data.id;
      navigate(`/shop/${shopId}`); // Redirect to the shop details page with the shop ID
    } catch (err) {
      setError('Failed to create shop. Please try to log out and log in again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Shop</h2>
      
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Shop Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location:</label>
          <select
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="">Select location</option>
            <option value="ujas">UJAS</option>
            <option value="cive">CIVE</option>
            <option value="social">Social</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Contact:</label>
          <input
            type="text"
            name="contact"
            className="form-control"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Logo:</label>
          <input
            type="file"
            name="logo"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Preview */}
        {logoPreview && (
          <div className="mb-3">
            <label className="form-label">Logo Preview:</label>
            <img src={logoPreview} alt="Logo Preview" className="img-thumbnail" width="150" />
          </div>
        )}

        {/* Submit Button with Loading Spinner */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
              <span className="ms-2">Creating Shop...</span>
            </>
          ) : (
            'Create Shop'
          )}
        </button>

        {error && <div className="alert alert-danger">{error}</div>}

      </form>
    </div>
  );
};

export default AddShop;
