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
  const [loading,setLoading]=useState(false);
  const [alert,setAlert]=useState(false);
  
 
useEffect(() => {
  const fetchShops = async () => {
    try {
      setLoding(true);
      const response = await getData('/user-shops/'); // Await the API call
      console.log(response);
      setLoading(false);
      setShops(response); // response.data is not needed since getData already returns response.data
    } catch (error) {
      setLoading(false);
      setAlert(true);
      console.error('Error fetching shops:', error);
    }
  };

  if (user?.id) { // Ensure user is defined and has an ID before making the request
    fetchShops();
  }
}, [user?.id]); // Depend on user ID to fetch only when it changes


  console.log("Here  are the shops",shops)

  
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
        {loading ? (<div className="loading d-flex align-items-center">
          
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only"></span>
              </div>
              <span className="ms-2">Loading data...</span>
      
        </div>):(
          <>
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
          <div classname="mt-3">
            {alert && <>
              <p >You have no Bussineses yet. Click <Link to="/addshop">here</Link> to add a business.</p>
              <p style={{color:"red"}}>If you have created business still this is showing try to log out and <Link to="/login">login</Link> again</p></>}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyShops;
