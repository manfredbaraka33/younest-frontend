import "../css/PoSCard.css"
import { Link } from "react-router-dom"
import { useState } from "react"
import { FaEye, FaMapMarkerAlt, FaSave } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import axiosService from "../helpers/axios";


function PoSCard3({ p,owner }) {
    const {user} = useAuth();
    const images = Array.isArray(p?.image) ? p.image : [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const formatNumber = (num) => new Intl.NumberFormat().format(num);
    const truncateText = (text,maxLength)=>{
        if (!text) return '';

        if(text.length > maxLength){
            return text.slice(0,maxLength) + '...';
        }
        return text;
    }

   console.log("here is the product",p);
   console.log("here is the owner",owner);

    // Function to go to the next image
    const nextImage = () => {
        if (currentImageIndex < p.image.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0); // Loop back to the first image
        }
    };

    // Function to go to the previous image
    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else {
            setCurrentImageIndex(p.image.length - 1); // Loop back to the last image
        }
    };

            // Function to handle the view event
        const handleProductClick = async () => {
            try {
            // Call your endpoint to increment view count
            await axiosService.post(`/product/${p.id}/increment-view/`);
            // Optionally, navigate to product detail or update UI accordingly
            console.log("View count incremented");
            } catch (error) {
            console.error("Failed to increment view count", error);
            }
        };

    return (
        <div className="pos-card">
            <Link style={{textDecoration:"none"}} to={`/pos/${p.id}`} onClick={handleProductClick}>
            <div className="pos-poster">
                {p.image.length > 1 && (
                    <button className="carousel-btn prev-btn" onClick={prevImage}>
                        &#10094;
                    </button>
                )}

                {/* Check if there's at least one image */}
                {images.length > 0 ? (
                    <img src={images[currentImageIndex]?.image} alt={p.name} />
                ) : (
                    <img src="default-image.jpg" alt="default" /> // Fallback if no images
                )}

                
                {p.image.length > 1 && (
                    <button className="carousel-btn next-btn" onClick={nextImage}>
                        &#10095;
                    </button>
                )}
            </div>
            </Link>
            <div className="pos-info p-2">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Link style={{textDecoration:"none"}} to={`/pos/${p.id}`} onClick={handleProductClick}>
                                <h3>{truncateText(p.name,15)}</h3>
                            </Link>
                        </div>
                        <div className="col">
                            <p className="">{formatNumber(Math.round(p.price,0))} Tsh</p>
                        </div>
                    </div>
                    {user.id == owner &&

                        <div className="row">
                        <div className="col"><FaSave /> {p.saves}</div>
                        <div className="col"><FaEye /> {p.views}</div>
                        </div>

                    }
                   
                </div>
            </div>
        </div>
    );
}

export default PoSCard3;
