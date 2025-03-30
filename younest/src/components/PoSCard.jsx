import "../css/PoSCard.css"
import { Link } from "react-router-dom"
import { useState } from "react"
import { FaMapMarkerAlt } from "react-icons/fa";
import SaveButton from "./SaveButton";
import { useAuth } from "../contexts/AuthContext";
import axiosService from "../helpers/axios";

function PoSCard({ p }) {
    const images = Array.isArray(p?.image) ? p.image : [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const {user}=useAuth();
    const formatNumber = (num) => new Intl.NumberFormat().format(num);

    const truncateText = (text,maxLength)=>{
        if (!text) return '';

        if(text.length > maxLength){
            return text.slice(0,maxLength) + '...';
        }
        return text;
    }

   

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
        <div className="pos-card  rounded">
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
            <div className="pos-info  p-2">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Link style={{textDecoration:"none"}} to={`/pos/${p.id}`} onClick={handleProductClick}>
                                <span style={{fontSize:"medium",fontWeight:"bold"}}>{truncateText(p.name,13)}</span>
                            </Link>
                        </div>
                        <div className="col-5">
                            <p className="">{formatNumber(Math.round(p.price,0))} Tsh</p>
                        </div>
                    </div>
                    <div className="row my-1">
                        <div className="col">
                            <Link style={{textDecoration:"none"}} to={`/shop/${p.shop.id}`}>
                            <span style={{fontSize:"medium",fontWeight:"bold"}} className="p-0"><img src={'https://younestapi.publicvm.com' + p.shop.logo} className="rounded-circle mx-2" width="30px" height="30px" alt="logo" /></span>
                            {truncateText(p.shop.name,15)}
                            </Link>
                        </div>
                    </div>
                    <div className="row text-primary mt-2 mb-1">
                    <div style={{fontSize:"medium",fontWeight:"bold"}} className="col px-4 text-secondary"><FaMapMarkerAlt/> {truncateText(p.shop.location,13)}</div>
                    
                   {user? ( <div className="col-4 save-btn text-end">
                            <SaveButton prodId={p.id} />
                        </div>):(<></>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PoSCard;
