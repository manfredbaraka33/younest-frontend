// import "../css/PoSCard.css"
// import { Link } from "react-router-dom"
// import { useState } from "react"

// function PoSCard2({ p }) {
//     const images = Array.isArray(p?.image) ? p.image : [];
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     // Function to go to the next image
//     const nextImage = () => {
//         if (currentImageIndex < p.image.length - 1) {
//             setCurrentImageIndex(currentImageIndex + 1);
//         } else {
//             setCurrentImageIndex(0); // Loop back to the first image
//         }
//     };

//     // Function to go to the previous image
//     const prevImage = () => {
//         if (currentImageIndex > 0) {
//             setCurrentImageIndex(currentImageIndex - 1);
//         } else {
//             setCurrentImageIndex(p.image.length - 1); // Loop back to the last image
//         }
//     };

//     return (
//         <div className="pos-card2">
//              {/* className="pos-poster" */}
//             <div className="">  
//                 {p.image.length > 1 && (
//                     <button className="carousel-btn prev-btn" onClick={prevImage}>
//                         &#10094;
//                     </button>
//                 )}

//                 {/* Check if there's at least one image */}
//                 {images.length > 0 ? (
//                     <img src={images[currentImageIndex]?.image}  className="image-fluid" alt={p.name} />
//                 ) : (
//                     <img src="default-image.jpg" className="image-fluid" alt="default" /> // Fallback if no images
//                 )}

                
//                 {p.image.length > 1 && (
//                     <button className="carousel-btn next-btn" onClick={nextImage}>
//                         &#10095;
//                     </button>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default PoSCard2;



import React, { useRef, useEffect, useState } from "react";
import "../css/PoSCard.css";


function PoSCard2({ p }) {
  const images = Array.isArray(p?.image) ? p.image : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef(null); // Ref for the carousel container

  // Fullscreen handling
  const handleDoubleClick = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        document.exitFullscreen().catch((err) => console.log(err));
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div className="pos-card2">
      <div className="carousel-container" ref={containerRef}>
        {images.length > 1 && (
          <button className="carousel-btn prev-btn" onClick={prevImage}>
            &#10094;
          </button>
        )}

        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]?.image}
            className="image-fluid"
            alt={p.name}
            onDoubleClick={handleDoubleClick}
          />
        ) : (
          <img
            src="default-image.jpg"
            className="image-fluid"
            alt="default"
            onDoubleClick={handleDoubleClick}
          />
        )}

        {images.length > 1 && (
          <button className="carousel-btn next-btn" onClick={nextImage}>
            &#10095;
          </button>
        )}
      </div>
    </div>
  );
}

export default PoSCard2;
