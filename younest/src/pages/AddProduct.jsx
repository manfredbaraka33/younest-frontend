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
  const navigate =useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files); // Debugging
    setImages(files);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    console.log('Images state after setting:', files); // Additional Debugging
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

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'shop') {
        data.append('shop', formData.shop?.id);
      } else {
        data.append(key, formData[key]);
      }
    });

    console.log('Images before submitting:', images); // Debugging

    images.forEach((image) => {
      data.append('images', image);
    });

    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

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
      console.log('Product created successfully:', response.data);
      navigate(`/shop/${shop.id}`);

    } catch (error) {
      setSuccess(false);
      setErrors(error);
      console.error('Product creation failed:', error);
    }
  };

  return (
    <div className="container mt-2">
      
      <form onSubmit={handleSubmit} className="">
        
      <br />
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
        <br /><br />
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
        <br /> <br />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          className="form-control my-1"
          placeholder='Tell the audience about you product...'
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
    <br /><br />
        <label htmlFor="category">Category:</label>
        <br />
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
          <option value="electronics">Electronics</option>
        </select>
   <br /><br />
        <h6>Type</h6>
        <input
          type="radio"
          id="product"
          name="type"
          value="product"
          unchecked={formData.type === 'product'}
          onChange={handleChange}
          required
        />
        <label htmlFor="product"> Product</label>
        <br />
        <input
          type="radio"
          id="service"
          name="type"
          value="service"
          unchecked={formData.type === 'service'}
          onChange={handleChange}
          required
        />
        <label htmlFor="service"> Service</label>
          <br /><br />
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
          Add
        </button>
        {errors && (
          <div className="alert alert-danger">
            <div>An error from our side occurred, please contact support team for help.</div>
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
