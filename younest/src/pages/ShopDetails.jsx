import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PoSCard3 from "../components/PosCard3";
import { useAuth } from "../contexts/AuthContext";
import { followUnfollowShop, getData, patchData } from "../helpers/axios"; 
import { FaArrowLeft } from "react-icons/fa";
import AddProduct from "./AddProduct"; // Import AddProduct component

const ShopDetails = () => {
  const { user } = useAuth();
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [pos, setPoS] = useState([]);
  const [loadingShop, setLoadingShop] = useState(true);
  const [loadingPos, setLoadingPos] = useState(true);
  const [error, setError] = useState(null);
  const [len, setLen] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({ name: "", location: "", contact: "", logo: null });
  const [logoPreview, setLogoPreview] = useState("");
  
  useEffect(() => {
    getShopDetails();
    getShopProducts();
  }, [shopId]);

  const getShopDetails = async () => {
    try {
      const data = await getData(`/shop/${shopId}/`);
      setShop(data);
      setEditData({ name: data.name, location: data.location, contact: data.contact, logo: null });
      setLogoPreview(data.logo);
      setIsFollowing(data.is_following);
      setFollowersCount(data.followers_count);
    } catch (error) {
      setError("Failed to load shop details.");
    } finally {
      setLoadingShop(false);
    }
  };

  const getShopProducts = async () => {
    try {
      const data = await getData(`/shop/${shopId}/products/`);
      setPoS(data);
      setLen(data.length);
    } catch (error) {
      setError("Failed to load products.");
    } finally {
      setLoadingPos(false);
    }
  };

  const handleFollowUnfollow = async () => {
    try {
      const updatedShop = await followUnfollowShop(shop.id); 
      setShop(updatedShop);
      setIsFollowing(updatedShop.is_following);
      setFollowersCount(updatedShop.followers_count);
    } catch (error) {
      console.error("Failed to follow/unfollow shop:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files && files[0]) {
      setEditData((prev) => ({ ...prev, logo: files[0] }));
      setLogoPreview(URL.createObjectURL(files[0])); // Update preview with selected file
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("location", editData.location);
      formData.append("contact", editData.contact);
      if (editData.logo) {
        formData.append("logo", editData.logo);
      }
      const updatedResponse = await patchData(`/shop/${shopId}/`, formData);
      setShop(updatedResponse);
      setEditData({ name: updatedResponse.name, location: updatedResponse.location, contact: updatedResponse.contact, logo: null });
      setLogoPreview(updatedResponse.logo);
      alert("Shop details updated successfully!");
      document.getElementById("editShopModalClose").click(); // Programmatically close the modal
    } catch (error) {
      console.error("Error updating shop details:", error);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div>{error}</div>;
  if (loadingShop || !shop) return <div>Loading shop details...</div>;
  if (loadingPos) return <div>Loading products...</div>;

  return (
    <div className="container-fluid py-0 mt-5">
      <Link to="/shops"><FaArrowLeft /></Link>
      <br /><br />
      <div>
        <h2 className="p-2 text-primary">
          <span>
            <img src={shop.logo} width="45px" height="45px" className="rounded-circle" alt="logo" />
          </span> {shop.name}
        </h2>
      </div>
      <div className="row">
        <div className="col my-1">
          <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-3 my-1"><span>Location: {shop.location}</span></div>
            <div className="col-sm-6 col-md-4 col-lg-3 my-1"><span>Contacts: {shop.contact}</span></div>
            <div className="col-sm-6 col-md-4 col-lg-3 my-1"><span>Followers: {followersCount}</span></div>
            <div className="col-sm-6 col-md-4 col-lg-3 my-1">
              {user && user.id !== shop.owner && (
                <button 
                  onClick={handleFollowUnfollow} 
                  className={isFollowing ? "unfollow-btn" : "follow-btn"}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
          <br />
        </div>
      </div>

      <div className="container-fluid my-2 p-0">
        <div className="row py-2">
          <div className="col">
            {user && user.id === shop.owner && (
              <div className="btn-group">
                <button className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#addProductModal">
                  Add product
                </button>
                <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editShopModal">
                  Edit details
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <h5>Products ({len})</h5>
          {pos.length > 0 ? (
            pos.map((p) => (
              <div className="col-sm-12 col-md-6 col-lg-4 my-2" key={p.id}>
                <PoSCard3 p={p} owner={shop.owner} />
              </div>
            ))
          ) : (
            <div>No results found.</div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-secondary" id="addProductModalLabel">Add Product</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-secondary">
              <AddProduct shop={shop} /> {/* AddProduct component here */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Shop Modal */}
      <div className="modal fade" id="editShopModal" tabIndex="-1" aria-labelledby="editShopModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editShopModalLabel">Edit Shop Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  placeholder="Shop Name"
                  className="form-control my-2"
                />
                <input
                  type="text"
                  name="location"
                  value={editData.location}
                  onChange={handleEditChange}
                  placeholder="Location"
                  className="form-control my-2"
                />
                <input
                  type="text"
                  name="contact"
                  value={editData.contact}
                  onChange={handleEditChange}
                  placeholder="Contact"
                  className="form-control my-2"
                />
                <div className="my-2">
                  <label>Logo</label>
                  <input
                    type="file"
                    name="logo"
                    onChange={handleEditChange}
                    className="form-control"
                  />
                  {logoPreview && <img src={logoPreview} width="50" alt="Logo Preview" className="my-2" />}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ShopDetails;

