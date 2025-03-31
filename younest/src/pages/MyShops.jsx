

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getData} from '../helpers/axios';
import { useNavigate } from 'react-router-dom';

const MyShops = () => {
  const [shops, setShops] = useState([]);
  const { user } = useAuth(); // Access the user from AuthContext
  const navigate = useNavigate();
  
  // useEffect(() => {
  //   const fetchShops = async () => {
      
  //       try {
  //         const response = await axiosService.get('/user-shops/');
  //         setShops(response.data);
  //       } catch (error) {
  //         console.error('Error fetching shops:', error);
  //       }
  //   };
  //   fetchShops();
  // }, [user]);

  useEffect(() => {
    const fetchShops = async () => {
        try {
            const response = await getData('/user-shops/');
            setShops(response.data);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    if (user) {  // Ensure user is defined before making the request
        fetchShops();
    }
}, [user?.id]);  // Use a stable dependency to avoid unnecessary re-renders


  console.log(shops)

  
  return (
    <div className='container mt-5'>
      <div className="row">
        <div className="col">
          <h6>My Businesses</h6>
        </div>
        <div className="col">
          <Link to="/addshop"><button className='btn btn-primary'>Create Business</button></Link>
        </div>
      </div>
      <div className='container'>
        {shops?.length > 0 ? (
          shops.map(shop => (
            <Link key={shop.id} style={{ textDecoration: "none" }} to={`/shop/${shop.id}`}>
              <div className='row border border-secondary p-2 rounded my-2'>
                <div className="col-lg-2 col-sm-9 col-md-3 my-2">
                  <img src={shop.logo} className='rounded-circle' width="80" height="80" alt="logo" />
                </div>
                <div className="col my-2">
                  <h5>{shop.name}</h5>
                  <p>Location: {shop.location}</p>
                  <p>Contact: {shop.contact}</p>
                  <p>Followers: {shop.followers_count}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div><p>You have no Bussineses yet. Click <Link to="/addshop">here</Link> to add a business.</p>
          <p>If you have created business still this is showing try to log out and <Link to="/login">login</Link> again</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyShops;
