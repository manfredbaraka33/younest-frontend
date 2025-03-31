import React, { useState, useEffect } from 'react';
import { patchData } from '../helpers/axios';  
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user, updateUserState } = useAuth(); // Get user from context
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profile_image, setProfilePic] = useState(user?.profile_image || null);  // Store selected profile picture file
  const [preview, setPreview] = useState(user?.profile_image || ''); // For previewing the selected image
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // If the user has a current profile picture, show it in the preview
    if (!profile_image && user?.profile_image) {
      setPreview(user?.profile_image);
    }
  }, [profile_image, user?.profile_image]);

  // Handle image preview when a new file is selected
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      setProfilePic(file); // Save the file for submission
      setPreview(previewUrl); // Update preview URL
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
     
      // Append the image ONLY if a new file is selected
      if (profile_image && profile_image instanceof File) {
        formData.append('profile_image', profile_image);
      }
  
      console.log("Final FormData values:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      const data = await patchData('/update-profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      updateUserState({
        ...user,
        username,
        email,
        profile_image: profile_image instanceof File ? URL.createObjectURL(profile_image) : user.profile_image,
      });
  
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      nav("/profile");
      setLoading(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating the profile.' });
      setLoading(false);
      console.error("Axios Error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Profile</h2>
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>



        <div className="mb-3">
          <label htmlFor="profilePic" className="form-label">Profile Picture:</label>
          <input
            type="file"
            className="form-control"
            id="profilePic"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}  // Display the preview image or the current one if not selected
                alt="Profile Preview"
                className="img-fluid rounded-circle"
                style={{ width: '150px', height: '150px' }}
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>

      </form>
    </div>
  );
};

export default EditProfile;
