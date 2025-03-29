import "../css/Home.css";
import React, { useEffect, useState } from "react";
import { fetchSavedProducts, getData } from '../helpers/axios'; 
import SavedPosCard from '../components/SavedPosCard';

const SavedPoS = () => {
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSavedProducts = async () => {
           
            
            try {
                const response = await fetchSavedProducts();
               
                
                if (!Array.isArray(response)) {
                    console.error("Invalid response format:", response);
                    setLoading(false);
                    return;
                }

                // Fetch shop details for each product
                const updatedProducts = await Promise.all(
                    response.map(async (product) => {
                      
                        
                        try {
                            const shopData = await getData(`/shop/${product.shop}/`);
                                  return { ...product, shopDetails: shopData }; // Append shop details
                        } catch (error) {
                            console.error(`Error fetching shop ${product.shop}:`, error);
                            return { ...product, shopDetails: null }; // Handle failed shop fetch
                        }
                    })
                );

                setSavedProducts(updatedProducts);
            } catch (error) {
                console.error("Error fetching saved products:", error);
            } finally {
                setLoading(false);
            }
        };

        getSavedProducts();
    }, []);

    // Remove product from list
    const handleRemoveProduct = (productId) => {
        console.log(`Removing product with ID: ${productId}`); // Debugging log
        setSavedProducts(savedProducts.filter(p => p.id !== productId));
    };

    return (
        <div className="container mt-5">
            <h2>Favourite Products</h2>
            <div className="row">
                {loading ? (
                    <p>Loading...</p>
                ) : savedProducts.length === 0 ? (
                    <p>No added favorite products yet.</p>
                ) : (
                    <div className="pos-grid">
                        {savedProducts.map((product) => (
                            <div className="col" key={product.id}>
                                <SavedPosCard 
                                    p={product} 
                                    onRemove={handleRemoveProduct} 
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SavedPoS;
