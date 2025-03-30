import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { validatePassword } from '../helpers/passwordValidator';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profile_image: null,
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleVisibility = (type) => {
    if (type === "password") {
      setPasswordVisible((prev) => !prev);
    } else {
      setConfirmPasswordVisible((prev) => !prev);
    }
  };

  useEffect(() => {
    setPasswordErrors(validatePassword(formData.password, { username: formData.username }));
  }, [formData.password, formData.username]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSuccess(false);
    setLoading(true);
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    if (passwordErrors.length > 0) {
      setErrors("Please fix the password errors before registering.");
      setLoading(false);
      return;
    }
  
    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post("https://younestapi.publicvm.com/api/register/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setErrors(null);
      setFormData({ username: "", bio: "", profile_image: null, email: "", password: "", confirmPassword: "" });
    } catch (error) {
      setSuccess(false);
  
      // Handle backend validation errors (e.g., username already taken or email already in use)
      if (error.response && error.response.data) {
        const errorMessages = error.response.data;
  
        // Check for specific errors and set them to state
        if (errorMessages.email) {
          setErrors(errorMessages.email[0]); // Show the email-related error message from the backend
        } else if (errorMessages.username) {
          setErrors(errorMessages.username[0]); // Show username-related errors
        } else {
          setErrors("An error occurred while registering. Please try again.");
        }
      } else {
        setErrors("An error occurred while registering. Please try again.");
      }
    }
    setLoading(false);
  };
  

  // Preview the profile picture
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profile_image: file,
    }));
  };

  // Render image preview if the profile image is selected
  const profileImagePreview = formData.profile_image
    ? URL.createObjectURL(formData.profile_image)
    : null;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">User Registration</h2>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password with Toggle */}
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => toggleVisibility("password")}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password && passwordErrors.length > 0 && (
              <div className="mt-2 alert alert-warning p-2">
                <ul className="mb-0">
                  {passwordErrors.map((error, index) => (
                    <li key={index} className="small">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-3 position-relative">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => toggleVisibility("confirmPassword")}
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="mb-3">
            <label htmlFor="profile_image" className="form-label">Profile Picture</label>
            <input
              type="file"
              className="form-control"
              id="profile_image"
              name="profile_image"
              onChange={handleProfileImageChange}
            />
            {profileImagePreview && (
              <div className="mt-3">
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="img-fluid rounded-circle"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          {success && <div className="alert alert-success">Registration successful! Click <Link to="/login">here</Link> to log in.</div>}
          {errors && <div className="alert alert-danger">{errors}</div>}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...</> : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
