import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UpdateUser = () => {
    const token = localStorage.getItem('token');
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [previewImage, setPreviewImage] = useState([]);
    const [error, setError] = useState('');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);

    const navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, { position: toast.POSITION.BOTTOM_CENTER });
    const successMsg = (message = '') => toast.success(message, { position: toast.POSITION.BOTTOM_CENTER });

    const getUserDetails = async (id) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, config);
            console.log()
            setUser(data.user);
            setLoading(false);
            setOldImages(data.user.image ? [data.user.image.url] : []);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const updateUser = async (id, userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/user/${id}`, userData, config);
            setIsUpdated(data.success);
        } catch (error) {
            setUpdateError(error.response.data.message);
        }
    };

    useEffect(() => {
        if (user && user._id !== id) {
            getUserDetails(id);
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            errMsg(error);
            setError('');
        }
        if (updateError) {
            errMsg(updateError);
            setUpdateError('');
        }
        if (isUpdated) {
            navigate('/admin/users');
            successMsg('User updated successfully');
        }
    }, [error, isUpdated, updateError, user, id, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);

        // Append old image
        oldImages.forEach((img) => {
            formData.append('image', img);
        });

        // Append new image
        if (image.length > 0) {
            formData.append('image', image[0]);
        }

        updateUser(user._id, formData);
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);
        setPreviewImage([]);
        setImage([]);
        setOldImages([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setPreviewImage((oldArray) => [...oldArray, reader.result]);
                    setImage((oldArray) => [...oldArray, file]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <Fragment>
            <MetaData title={'Update User'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Update User</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role_field">Role</label>
                                    <select
                                        id="role_field"
                                        className="form-control"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="image_field">Image</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='image'
                                            className='custom-file-input'
                                            id='image_field'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='image_field'>
                                            Choose Image
                                        </label>
                                    </div>
                                    {oldImages && oldImages.map((img, index) => (
                                        <img key={index} src={img} alt={img} className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                    {previewImage.map((img, index) => (
                                        <img key={index} src={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                </div>

                                <button
                                    id="update_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                    UPDATE
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateUser;
