import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    let navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);

        images.forEach(image => {
            formData.append('images', image)
        })

        createCategory(formData);
    };

    const onChange = (e) => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((oldArray) => [...oldArray, reader.result]);
                    setImages((oldArray) => [...oldArray, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const createCategory = async (formData) => {
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/admin/category/create`,
                formData,
                config
            );

            setLoading(false);
            setSuccess(data.success);
            toast.success('Category created successfully', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message);
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        if (success) {
            navigate('/admin/categories');
        }
    }, [error, success]);

    return (
        <Fragment>
            <MetaData title={'New Category'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                                <h1 className="mb-4">New Category</h1>

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
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            name="image"
                                            className="custom-file-input"
                                            id="image_field"
                                            accept="images/*"
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className="custom-file-label" htmlFor="image_field">
                                            Choose Image
                                        </label>
                                    </div>

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                </div>

                                <button id="login_button" type="submit" className="btn btn-block py-3" disabled={loading}>
                                    CREATE
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default CreateCategory;
