import React, { useState, useEffect } from 'react';
import { putData } from '../helpers/axios';
import { validatePassword } from '../helpers/passwordValidator';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [message, setMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const toggleVisibility = (field) => {
    setPasswordVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const userAttributes = {};

  useEffect(() => {
    const errors = validatePassword(newPassword, userAttributes);
    setValidationErrors(errors);
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (newPassword !== newPasswordConfirm) {
      setMessage({ type: "error", text: "New passwords do not match." });
      setLoading(false);
      return;
    }

    if (validationErrors.length > 0) {
      setMessage({ type: "error", text: "Please fix the errors in your new password before submitting." });
      setLoading(false);
      return;
    }

    try {
      const data = await putData('/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });

      setMessage({ type: "success", text: data.detail });
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.old_password) {
          setMessage({ type: "error", text: "Incorrect old password. Please try again." });
        } else {
          setMessage({ type: "error", text: "An error occurred while changing the password." });
        }
      } else {
        setMessage({ type: "error", text: "Network error. Please try again." });
      }
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Change Password</h2>
      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label htmlFor="oldPassword" className="form-label">Old Password:</label>
          <div className="input-group">
            <input
              type={passwordVisible.old ? "text" : "password"}
              className="form-control"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility('old')}>
              {passwordVisible.old ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="newPassword" className="form-label">New Password:</label>
          <div className="input-group">
            <input
              type={passwordVisible.new ? "text" : "password"}
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility('new')}>
              {passwordVisible.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {newPassword && validationErrors.length > 0 && (
            <div className="mt-2 alert alert-warning p-2">
              <ul className="mb-0">
                {validationErrors.map((error, index) => (
                  <li key={index} className="small">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="newPasswordConfirm" className="form-label">Confirm New Password:</label>
          <div className="input-group">
            <input
              type={passwordVisible.confirm ? "text" : "password"}
              className="form-control"
              id="newPasswordConfirm"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility('confirm')}>
              {passwordVisible.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Changing...</> : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
