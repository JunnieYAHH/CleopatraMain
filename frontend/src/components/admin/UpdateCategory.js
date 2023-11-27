import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UpdateCategory = () => {
    const token = localStorage.getItem('token');
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [previewImage, setPreviewImage] = useState([]);
    const [error, setError] = useState('');
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);

    const navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, { position: toast.POSITION.BOTTOM_CENTER });
    const successMsg = (message = '') => toast.success(message, { position: toast.POSITION.BOTTOM_CENTER });

    const getCategoryDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/${id}`);
            setCategory(data.category);
            setLoading(false);
            setOldImages(data.category.images.map(img => img.url));
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const updateCategory = async (id, categoryData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/category/${id}`, categoryData, config);
            setIsUpdated(data.success);
        } catch (error) {
            setUpdateError(error.response.data.message);
        }
    };

    useEffect(() => {
        if (category && category._id !== id) {
            getCategoryDetails(id);
        } else {
            setName(category.name);
            setDescription(category.description);
        }

        if (error) {
            errMsg(error);
        }
        if (updateError) {
            errMsg(updateError);
        }
        if (isUpdated) {
            navigate('/admin/categories');
            successMsg('Category updated successfully');
        }
    }, [error, isUpdated, updateError, category, id, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);

        // Append old images
        oldImages.forEach((img) => {
            formData.append('images', img);
        });

        // Append new images
        for (let i = 0; i < image.length; i++) {
            formData.append('images', image[i]);
        }

        updateCategory(category._id, formData);
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
                    setImage((oldArray) => [...oldArray, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });
    };


    return (
        <Fragment>
            <MetaData title={'Update Category'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Update Category</h1>
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
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description_field"
                                        rows="8"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
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
                                    disabled={loading ? true : false}
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

export default UpdateCategory;
