import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const nav = useNavigate();
    const {user,logout} = useAuth();
    const to_change_password = () => nav("/change_password");
    const to_edit_profile= () => nav("/edit_profile");

  return (

<div className="container-fluid p-4 mt-5">
    <div className="">
        {/* Profile Image Section */}
    <div className="row justify-content-center mb-4">
        <div className="col-12  text-center">
            
                <img 
                    width="150px" 
                    height="150px" 
                    className='rounded-circle' 
                    src={user?.profile_image} 
                    alt={user?.username} 
                    style={{ objectFit: 'cover' }} 
                />
          
        </div>
    </div>

    {/* User Info Section */}
    <div className="row text-center">
        <div className="col-12 col-md-6 mb-3">
            <h5 className="font-weight-bold text-muted">Username</h5>
            <p className="">{user?.username}</p>
        </div>
        <div className="col-12 col-md-6 mb-3">
            <h5 className="font-weight-bold text-muted">Email address</h5>
            <p className="">{user?.email}</p>
        </div>
    </div>

    {user?.bio && (
        <div className="row">
        <center>
        <div className="col">
            <h6>Bio</h6>
            <p>{user?.bio}</p>
        </div>
        </center>
    </div>
    )}

   <center>
     {/* Log Out Button Section */}
    
    <div className="btn-group">

       <button onClick={logout} className="btn btn-outline-danger">
            Log out
        </button>

        <button onClick={to_change_password}  className="btn btn-outline-primary">
            Change password
        </button>

        <button onClick={to_edit_profile}  className="btn btn-outline-primary">
           Edit Profile
        </button>
    </div>
   </center>
    </div>
</div>
  )
}

export default Profile