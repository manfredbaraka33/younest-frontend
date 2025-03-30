import React, { useState } from 'react';
import axiosService from '../helpers/axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ shop }) => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    shop: shop,
    name: '',
    price: 0,
    description: '',
    category: '',
    type: '',
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loading process
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'shop') {
        data.append('shop', formData.shop?.id);
      } else {
        data.append(key, formData[key]);
      }
    });

    images.forEach((image) => {
      data.append('images', image);
    });

    try {
      const response = await axiosService.post('/pos/create/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      setErrors(null);
      setFormData({
        shop: shop,
        name: '',
        price: 0,
        description: '',
        category: '',
        type: '',
      });
      setImages([]);
      setPreviewUrls([]);
      setLoading(false); // Stop loading
      window.alert("Product created successfully");
      navigate(`/shop/${shop.id}`);
    } catch (error) {
      setSuccess(false);
      setLoading(false); // Stop loading
      setErrors(error);
    }
  };

  return (
    <div className="container mt-2">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name of the product:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          className="form-control my-1"
          placeholder="Tell the audience about your product..."
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          className="form-control"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="houseware">Houseware</option>
          <option value="electronics">Electronics</option>
          <option value="other">Other</option>
          <option value="healthcare">Healthcare</option>
          <option value="kitchen">Kitchen</option>
          <option value="banking">Banking</option>
          <option value="mobile money">Mobile Money</option>
          <option value="recreation">Recreation</option>
          <option value="body care">Body care</option>
          <option value="clothing">Clothing</option>
        </select>
        <br />
        <h6>Type</h6>
        <input
          type="radio"
          id="product"
          name="type"
          value="product"
          checked={formData.type === 'product'}
          onChange={handleChange}
          required
        />
        <label htmlFor="product">Product</label>
        <br />
        <input
          type="radio"
          id="service"
          name="type"
          value="service"
          checked={formData.type === 'service'}
          onChange={handleChange}
          required
        />
        <label htmlFor="service">Service</label>
        <br />
        <label htmlFor="imageUpload">Upload image(s):</label>
        <input
          className="form-control my-2"
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <div className="image-previews">
          {previewUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              width="100"
              height="100"
              alt={`Preview ${index + 1}`}
            />
          ))}
        </div>

        <button type="submit" className="btn btn-outline-primary my-3">
          {loading ? (
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only"></span>
              </div>
              <span className="ms-2">Creating product...</span>
            </div>
          ) : (
            'Add'
          )}
        </button>

        {errors && (
          <div className="alert alert-danger">
            <div>An error occurred. Please try again later.</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            Congratulations! Your product has been added.
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;


// export default AddProduct;
