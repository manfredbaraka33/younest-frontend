// import React, { useEffect, useState } from 'react';
// import { useParams,useNavigate } from 'react-router-dom';
// import useSWR from 'swr';
// import { Link } from 'react-router-dom';
// import PoSCard2 from '../components/PoSCard2';
// import { useAuth } from '../contexts/AuthContext';
// import { patchData,deleteData } from '../helpers/axios';
// import { FaArrowLeft } from 'react-icons/fa';
// import SaveButton from '../components/SaveButton';
// import ReviewModal from '../components/ReviewModal';
// import ProductReviews from '../components/ProductReviews';
// import ReviewEditModal from '../components/ReviewEditModal';
// import { getData } from '../helpers/axios';
// import PoSCard from "../components/PoSCard";

// const PoSDetails = () => {
//   const [loading, setLoading] = useState(false);
//   const [loading2, setLoading2] = useState(false);
//   const { posId } = useParams();
//   const [error, setError] = useState(null);
//   const [product, setProduct] = useState(null);
//   const {user}=useAuth();
//   const navigate =useNavigate()
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [images, setImages] = useState([]);
//   const [hasReview, setHasReview] = useState(false);
//   const [isModalReviewOpen, setIsModalReviewOpen] = useState(false);
//   const [isModalReviewEditOpen, setIsModalReviewEditOpen] = useState(false);
//   const [reviewId,setReviewId]=useState();
//   const [reviewComment,setReviewComment]=useState();
//   const [reviewRating,setReviewRating]=useState();
//   const [showFull, setShowFull] = useState(false);
//   const MAX_LENGTH = 100; // Truncate limit
//   const formatNumber = (num) => new Intl.NumberFormat().format(num);
//   const toggleShowMore = () => setShowFull(!showFull);
//   const openModalReview = () => setIsModalReviewOpen(true);
//   const closeModalReview = () => setIsModalReviewOpen(false);
//   const openModalReviewEdit = () => setIsModalReviewEditOpen(true);
//   const closeModalReviewEdit = () => setIsModalReviewEditOpen(false);
//   const [recommendedProducts, setRecommendedProducts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const getDetails = async () => {
//     const response = await fetch(`https://younestapi.publicvm.com/api/pos/${posId}/`);
//     const data = await response.json();
//     return data;
//   };

  

//   useEffect(() => {
//     getProductRecommendations();
//     const loadPosDetails = async () => {
//       setLoading2(true);
//       try {
//         const posDetails = await getDetails();
//         setProduct(posDetails);
//       } catch (err) {
//         setError("Failed to load items...");
//       } finally {
//         setLoading2(false);
//       }
//     };

//     loadPosDetails();
//   }, [posId]);


//     useEffect(() => {
//       if (posId) {
//         // Check if the user has already reviewed the product
//         getData(`/reviews/check/${posId}/`)
//           .then((data) => {
//             if (data.review_exists) {
//               setHasReview(true);
//               setReviewId(data.review_id); 
//               setReviewComment(data.comment);
//               setReviewRating(data.rating);
//             } else {
//               setHasReview(false);
//             }
//           })
//           .catch((error) => console.error("Error checking review:", error));
//       }
//     }, [posId]);

//    // Handle input changes
//    const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };



//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     // console.log('Files selected:', files); // Debugging
//     setImages(files);
//     const newPreviewUrls = files.map(file => URL.createObjectURL(file));
//     setPreviewUrls(newPreviewUrls);
//     console.log('Images state after setting:', files); // Additional Debugging
//   };


       
  
//       const handleUpdate = async () => {
//       setLoading(true);  
//       const formData = new FormData();
//       formData.append("name", product.name);
//       formData.append("price", product.price);
//       formData.append("description", product.description);
//       formData.append("category", product.category);

//       // Now append the images
//       images.forEach((image) => {
//         formData.append('images', image);
//       });
//       try {
        
//         const updated = await patchData(`/pos/${posId}/update/`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         // Update state with new product details
//         setProduct(updated);
//         setLoading(false);
//         alert("Product updated successfully!");
//         setIsModalOpen(false);
//         navigate(`/pos/${posId}`);

//       } catch (err) {
//         setLoading(false);
//         console.error("Failed to update product:", err);
//         alert("Failed to update product. Check your internet connection and try again!");
//       }
//     };
    


//    // Handle delete
//     const deleteItem = async () => {
//       if (window.confirm("Are you sure you want to delete this item?")) {
//         try {
//           await deleteData(`/pos/${posId}/delete/`);
//           alert("Product deleted successfully!");
//           navigate(`/shop/${product.shop?.id}`);
//         } catch (err) {
//           console.error("Failed to delete product:", err);
//           alert("Failed to delete product.");
//         }
//       }
//     };


//      // Handle delete
//      const deleteReview = async () => {
//       if (window.confirm("Are you sure you want to delete this your review on this product?")) {
//         try {
//           await deleteData(`/reviews/${reviewId}/delete/`);
//           alert("Review deleted successfully!");
//           navigate(`/pos/${product?.id}`);
//         } catch (err) {
//           console.error("Failed to delete review:", err);
//           alert("Failed to delete review.");
//         }
//       }
//     };



//     const getProductRecommendations = async () => {
//       try {
//         const data = await getData(`/product/${posId}/recommendations/`);
//         setRecommendedProducts(data.products);
//         console.log("Here is what is set",data);
//       } catch (error) {
//         console.error("Failed to load recommended products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  


//   if (error) return <div>Error loading product details.</div>;
//   if (loading || !product) return <div>Loading...</div>;

//   return (
//     <div className="container-fluid mt-5 p-2">
      
//       {product && (
//         <>
//           <h6> <Link to="/" className="mx-4"><FaArrowLeft /></Link>
//             {product.name} by{' '}
//             <Link className="" style={{ textDecoration: 'none' }} to={`/shop/${product.shop?.id}`}>
//               {product.shop?.name || ''}
//             </Link>
//             <SaveButton className="mx-2" prodId={product.id} />
//           </h6>
//           <div className="row">
//             <div className="col my-2">
//               <center>
//               <PoSCard2 p={product} />
//                 <small>Double tap image to enter or exit full-screen mode</small>
//               </center>
//             </div>
//             <div className="col my-2">
//               <div className="">
//                 <div className="">
  
//                         <table>
//                           <thead className='bg-secondary text-light'>
//                             <tr>
//                               <th>Item</th>
//                               <th>Info</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             <tr><td>Price</td><td>{formatNumber(Math.round(product.price,0))} Tshs</td></tr>
//                             <tr><td>Category</td><td>{product.category}</td></tr>
//                             <tr><td>Location</td><td>{product.shop?.location}</td></tr>
//                             <tr><td>Contact</td><td>{product.shop?.contact}</td></tr>
//                           </tbody>
//                         </table>
                     
//                          <br />
//                         {user?.id == product.shop.owner && (
//                         <div className='btn-group mx-1'>
//                         <button className="btn btn-outline-secondary my-2"  onClick={() => setIsModalOpen(true)}>Edit product</button>
//                         <button className="btn btn-outline-danger my-2" onClick={deleteItem}>Delete product</button>
//                       </div>
//                       )}

//                       {user && (
//                         <>
//                           {hasReview ? (
//                                     // If the user has already reviewed, show the Edit and delete buttons
//                                     <div className="btn-group mx-1">
//                                     <button onClick={openModalReviewEdit} className="btn btn-outline-secondary px-3">
//                                       Edit Review
//                                     </button>
//                                     <butt className="btn btn-outline-danger px-3" onClick={deleteReview}>Delete review</butt>
//                                     </div>
//                                   ) : (
//                                     // Otherwise, show the Write a Review button
//                                     <button onClick={openModalReview} className="btn btn-outline-primary">
//                                       Write a Review
//                                     </button>
//                                   )}
                                                          
//                               {/* Modal for review form */}
//                               <ReviewModal isOpen={isModalReviewOpen} product={product} onClose={closeModalReview} />

//                               {/* Modal for review edit form */}
//                               <ReviewEditModal isOpen={isModalReviewEditOpen} reviewId={reviewId} reviewComment={reviewComment} reviewRating={reviewRating}  product={product} onClose={closeModalReviewEdit} />
//                         </>
//                       )}

//                 </div>
//               </div>
//             </div>
//           </div>

//             <div className="container my-4 mb-4  py-3 ">
//             <h4>More about {product?.name}</h4>
//             <p className="card-text">
//               {showFull || product?.description.length <= MAX_LENGTH
//                 ? product?.description
//                 : product?.description.slice(0, MAX_LENGTH) + "..."}
//             </p>
//             {product?.description.length > MAX_LENGTH && (
//               <button className="btn btn-link p-0" onClick={toggleShowMore}>
//                 {showFull ? "View Less" : "View More"}
//               </button>
//             )}
//           </div>

//           <div className="container-fluid  my-2 border rounded border-secondary border-1">
//           <ProductReviews product={product} />
//           </div>

//             <div className="container-fluid recomendation-container my-2 py-2">
//               <h2>You might also like</h2>

//               <div className="row">
//                 {recommendedProducts.length > 0 ? (
//                   recommendedProducts.map((recommendedProduct) => (
                    
//                       <div className="pos-grid">
//                         <div className="col"><PoSCard key={recommendedProduct.id} p={recommendedProduct} /></div>
//                       </div>
                   
//                   ))
//                 ) : (
//                   <p>No recommendations available.</p>
//                 )}
//               </div>
//             </div>
//         </>
//       )}

// {/* Bootstrap Modal */}
// <div
//         className={`modal ${isModalOpen ? "show" : ""}`}
//         tabIndex="-1"
//         style={{ display: isModalOpen ? "block" : "none" }}
//         aria-labelledby="updateModalLabel"
//         aria-hidden={!isModalOpen}
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="updateModalLabel">
//                 Update Product
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 onClick={() => setIsModalOpen(false)}
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <form>
//                 <div className="mb-3">
//                   <label className="form-label">Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="name"
//                     value={product.name || ''}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Price</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     name="price"
//                     value={product.price || ''}
//                     onChange={handleInputChange}
//                   />
//                 </div>
              
//                 <div className="mb-3">
//                   <label htmlFor="form-label">Category</label>
//                   <select className='form-control' name="category" value={product.category} 
//                   onChange={handleInputChange}
//                   >
//                   <option value="food">Food</option>
//                   <option value="houseware">Houseware</option>
//                   <option value="electronics">Electronics</option>
//                   <option value="other">Other</option>
//                   <option value="healthcare">Healthcare</option>
//                   <option value="kitchen">Kitchen</option>
//                   <option value="banking">Banking</option>
//                   <option value="mobile money">Mobile Money</option>
//                   <option value="recreation">Recreation</option>
//                   <option value="body care">Body care</option>
//                   <option value="clothing">Clothing</option>
//                   </select>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Description</label>
//                   <textarea
//                     className="form-control"
//                     name="description"
//                     value={product.description || ''}
//                     onChange={handleInputChange}
//                   ></textarea>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Images</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     name="images"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageChange}
//                   />

//                 <div className="image-previews">
//                           {previewUrls.map((url, index) => (
//                             <img
//                               key={index}
//                               src={url}
//                               width="100"
//                               height="100"
//                               alt={`Preview ${index + 1}`}
//                             />
//                           ))}
//                         </div>

//                 </div>
//               </form>
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Close
//               </button>
//             <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
//               {loading ? "Saving..." : "Save Changes"}
//             </button>
//               {loading && <p className="text-center text-primary">Updating product...</p>}

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PoSDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PoSCard2 from '../components/PoSCard2';
import { useAuth } from '../contexts/AuthContext';
import { patchData, deleteData, getData } from '../helpers/axios';
import { FaArrowLeft } from 'react-icons/fa';
import SaveButton from '../components/SaveButton';
import ReviewModal from '../components/ReviewModal';
import ProductReviews from '../components/ProductReviews';
import ReviewEditModal from '../components/ReviewEditModal';
import PoSCard from "../components/PoSCard";

const PoSDetails = () => {
  // loading states:
  // loading   -> for updating the product
  // loading2  -> for fetching product details
  // loadingRecommendations -> for recommendations
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const { posId } = useParams();
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [hasReview, setHasReview] = useState(false);
  const [isModalReviewOpen, setIsModalReviewOpen] = useState(false);
  const [isModalReviewEditOpen, setIsModalReviewEditOpen] = useState(false);
  const [reviewId, setReviewId] = useState();
  const [reviewComment, setReviewComment] = useState();
  const [reviewRating, setReviewRating] = useState();
  const [showFull, setShowFull] = useState(false);
  const MAX_LENGTH = 100; // Truncate limit
  const formatNumber = (num) => new Intl.NumberFormat().format(num);
  const toggleShowMore = () => setShowFull(!showFull);
  const openModalReview = () => setIsModalReviewOpen(true);
  const closeModalReview = () => setIsModalReviewOpen(false);
  const openModalReviewEdit = () => setIsModalReviewEditOpen(true);
  const closeModalReviewEdit = () => setIsModalReviewEditOpen(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch product details
  const getDetails = async () => {
    const response = await fetch(`https://younestapi.publicvm.com/api/pos/${posId}/`);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const loadPosDetails = async () => {
      setLoading2(true);
      try {
        const posDetails = await getDetails();
        setProduct(posDetails);
      } catch (err) {
        setError(err.message || "Failed to load items...");
      } finally {
        setLoading2(false);
      }
    };

    loadPosDetails();
    getProductRecommendations(); // Fetch recommendations in parallel
  }, [posId]);

  // Check if the user has already reviewed the product
  useEffect(() => {
    if (posId) {
      getData(`/reviews/check/${posId}/`)
        .then((data) => {
          if (data.review_exists) {
            setHasReview(true);
            setReviewId(data.review_id);
            setReviewComment(data.comment);
            setReviewRating(data.rating);
          } else {
            setHasReview(false);
          }
        })
        .catch((error) => console.error("Error checking review:", error));
    }
  }, [posId]);

  // Handle input changes for product details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    console.log('Images state after setting:', files);
  };

  // Update product details
  const handleUpdate = async () => {
    setLoading(true);  
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);

    // Append selected images
    images.forEach((image) => {
      formData.append('images', image);
    });
    try {
      const updated = await patchData(`/pos/${posId}/update/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
       // Re-fetch full product details
      const updatedFullProduct = await getDetails();
      setProduct(updatedFullProduct);
      //setProduct(updated);  // Update local product state
      alert("Product updated successfully!");
      setIsModalOpen(false);
      // navigate(`/pos/${posId}`);
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product. Check your internet connection and try again!");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteItem = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteData(`/pos/${posId}/delete/`);
        alert("Product deleted successfully!");
        navigate(`/shop/${product.shop?.id}`);
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product.");
      }
    }
  };

  // Delete review
  const deleteReview = async () => {
    if (window.confirm("Are you sure you want to delete your review on this product?")) {
      try {
        await deleteData(`/reviews/${reviewId}/delete/`);
        alert("Review deleted successfully!");
        navigate(`/pos/${product?.id}`);
      } catch (err) {
        console.error("Failed to delete review:", err);
        alert("Failed to delete review.");
      }
    }
  };

  // Fetch product recommendations separately using its own loading state
  const getProductRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const data = await getData(`/product/${posId}/recommendations/`);
      setRecommendedProducts(data.products);
      console.log("Here is what is set", data);
    } catch (error) {
      console.error("Failed to load recommended products:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Render conditions for product details
  if (loading2) return <div>Loading product details...</div>;
  if (error) return <div>Error loading product details: {error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="container-fluid mt-5 p-2">
      {product && (
        <>
          <h6>
            <Link to="/" className="mx-4">
              <FaArrowLeft />
            </Link>
            {product.name} by{" "}
            <Link className="" style={{ textDecoration: 'none' }} to={`/shop/${product.shop?.id}`}>
              {product.shop?.name || ''}
            </Link>
            <SaveButton className="mx-2" prodId={product.id} />
          </h6>
          <div className="row">
            <div className="col my-2">
              <center>
                <PoSCard2 p={product} />
                <small>Double tap image to enter or exit full-screen mode</small>
              </center>
            </div>
            <div className="col my-2">
              <table>
                <thead className='bg-secondary text-light'>
                  <tr>
                    <th>Item</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    <td>{formatNumber(Math.round(product.price))} Tshs</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>{product.shop?.location}</td>
                  </tr>
                  <tr>
                    <td>Contact</td>
                    <td>{product.shop?.contact}</td>
                  </tr>
                </tbody>
              </table>
              <br />
              {user?.id === product.shop.owner && (
                <div className='btn-group mx-1'>
                  <button className="btn btn-outline-secondary my-2" onClick={() => setIsModalOpen(true)}>
                    Edit product
                  </button>
                  <button className="btn btn-outline-danger my-2" onClick={deleteItem}>
                    Delete product
                  </button>
                </div>
              )}
              {user && (
                <>
                  {hasReview ? (
                    <div className="btn-group mx-1">
                      <button onClick={openModalReviewEdit} className="btn btn-outline-secondary px-3">
                        Edit Review
                      </button>
                      <button className="btn btn-outline-danger px-3" onClick={deleteReview}>
                        Delete review
                      </button>
                    </div>
                  ) : (
                    <button onClick={openModalReview} className="btn btn-outline-primary">
                      Write a Review
                    </button>
                  )}
                  {/* Modal for review form */}
                  <ReviewModal isOpen={isModalReviewOpen} product={product} onClose={closeModalReview} />
                  {/* Modal for review edit form */}
                  <ReviewEditModal
                    isOpen={isModalReviewEditOpen}
                    reviewId={reviewId}
                    reviewComment={reviewComment}
                    reviewRating={reviewRating}
                    product={product}
                    onClose={closeModalReviewEdit}
                  />
                </>
              )}
            </div>
          </div>
          <div className="container my-4 mb-4 py-3">
            <h4>More about {product?.name}</h4>
            <p className="card-text">
              {showFull || product?.description.length <= MAX_LENGTH
                ? product?.description
                : product?.description.slice(0, MAX_LENGTH) + "..."}
            </p>
            {product?.description.length > MAX_LENGTH && (
              <button className="btn btn-link p-0" onClick={toggleShowMore}>
                {showFull ? "View Less" : "View More"}
              </button>
            )}
          </div>
          <div className="container-fluid my-2 border rounded border-secondary border-1">
            <ProductReviews product={product} />
          </div>
          <div className="container-fluid recomendation-container my-2 py-2">
            <h2>You might also like</h2>
            {loadingRecommendations ? (
              <p>Loading recommendations...</p>
            ) : recommendedProducts.length > 0 ? (
              <div className="row">
                {recommendedProducts.map((recommendedProduct) => (
                  <div key={recommendedProduct.id} className="col">
                    <PoSCard p={recommendedProduct} />
                  </div>
                ))}
              </div>
            ) : (
              <p>No recommendations available.</p>
            )}
          </div>
        </>
      )}

      {/* Bootstrap Modal for updating product */}
      <div
        className={`modal ${isModalOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{ display: isModalOpen ? "block" : "none" }}
        aria-labelledby="updateModalLabel"
        aria-hidden={!isModalOpen}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">
                Update Product
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={product.name || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={product.price || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="form-label">Category</label>
                  <select
                    className='form-control'
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                  >
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
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={product.description || ''}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Images</label>
                  <input
                    type="file"
                    className="form-control"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
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
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              {loading && (
                <p className="text-center text-primary">Updating product...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoSDetails;

