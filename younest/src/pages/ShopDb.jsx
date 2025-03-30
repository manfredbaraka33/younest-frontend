import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosService from '../helpers/axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
// Register necessary chart elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ShopDb = () => { 
    const { shopId } = useParams();
    const [shopData, setShopData] = useState(null);
    const [error, setError] = useState(null);
    const [kpis, setKpis] = useState(null);
    const [topProducts, setTopProducts] = useState(null);
    const [categoryViews, setCategoryViews] = useState(null);

    useEffect(() => {
        // Fetch the shop data when the component mounts
        axiosService.get(`/shop-dashboard/${shopId}/`)
            .then((response) => {
                setKpis(response.data.kpis);
                setTopProducts(response.data.top_products);
                setCategoryViews(response.data.category_views);
                setShopData(response.data.shop_name); // Store the shop name
            })
            .catch((error) => {
                console.error('Error fetching dashboard data:', error);
                setError("Failed to load shop data.");
            });
    }, [shopId]);

    // Data for Horizontal Bar Chart
    const horizontalBarChartData = {
        labels: topProducts?.views.map(product => product.name) || [],
        datasets: [
            {
                label: 'Views',
                data: topProducts?.views.map(product => product.views) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Saves',
                data: topProducts?.saves.map(product => product.saves) || [],
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
            },
        ],
    };


        const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows custom height
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };


    // Data for Pie Chart (Product Categories by Views)
    const pieChartData = {
        labels: categoryViews?.map(category => category.category) || [],
        datasets: [
            {
                data: categoryViews?.map(category => category.total_views) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
            },
        ],
    };

    // Error Handling and Loading State
    if (error) return <div>{error}</div>;
    if (!shopData) return <div>Loading...</div>;

    return (
        <div className="container mt-5 p-3">
            <center><h4 className='bg-primary text-light rounded p-2'>{shopData} Analytics</h4></center>
            {kpis && (
                <center>
                    <div className="kpis row">
                    <div className='col-sm-11 col-md-6 col-lg-3 my-2'>
                       <h2> {kpis.total_followers}</h2>
                            <span>Followers</span>
                    </div>
                    <div className='col-sm-11 col-md-6 col-lg-3 my-2'>
                       <h2> {kpis.total_views}</h2>
                         <span>Total views</span>
                    </div>
                    <div className='col-sm-11 col-md-6 col-lg-3 my-2'>
                       <h2> {kpis.total_saves}</h2>
                        <span>Total saves</span>
                        </div> 
                      
                </div>
                </center>
            )}
 
          
           
           <center>

           <div className="container">
           <div className="row">
            <div className="col">
            <div className="charts  style={{ height: '250px', maxHeight: '50vh' }}>
                <h4>Top Products (Views & Saves)</h4>
                <Bar data={horizontalBarChartData} options={barChartOptions} />
            </div>
            </div>
           </div>
           </div>


           <div className="container my-3">
           <div className="row">
           <div className="col">  
               <h4>Product Categories by Views</h4>
            <div className="charts pie-chart">
                <Pie data={pieChartData} options={{ responsive: true }}  />
            </div>
            </div>
           </div>

           </div>
           </center>

        </div>
    );
};

export default ShopDb;
