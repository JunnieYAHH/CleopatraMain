import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../layouts/MetaData'


const Profile = () => {

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Fragment>
            <MetaData title={'Your Profile'} />

            <h2 className="mt-5 ml-5">My Profile</h2>
            <div className="row justify-content-around mt-5 user-info">
                <div className="col-12 col-md-3">

                    <figure className='avatar avatar-profile'>
                        {user.avatar && user.avatar.length > 0 && (
                            <div className="avatar-array">
                                {user.avatar.map((avatar, index) => (
                                    <img key={index} src={avatar.url} alt={user.name} className="rounded-circle" />
                                ))}
                            </div>
                        )}
                    </figure>
                    <Link to="/me/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                        Edit Profile
                    </Link>
                </div>

                <div className="col-12 col-md-5">
                    <h4>Full Name</h4>
                    <p>{user.name}</p>

                    <h4>Email Address</h4>
                    <p>{user.email}</p>

                    <h4>Joined On</h4>
                    <p>{String(user.createdAt).substring(0, 10)}</p>
                    {user.role !== 'admin' && (
                        <Link to="/orders/me" className="btn btn-danger btn-block mt-5">
                            My Orders
                        </Link>
                    )}

                    {/* <Link to="/password/update" className="btn btn-primary btn-block mt-3">
                        Change Password
                    </Link> */}
                </div>
            </div>

        </Fragment>
    )
}

export default Profile