import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);
    const token = localStorage.getItem('token');

    console.log(categories)

    let navigate = useNavigate();

    const getAdminCategories = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/categories`, config);
            console.log(data);
            setCategories(data.category);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        getAdminCategories();

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        if (isDeleted) {
            toast.success('Category deleted successfully', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            navigate('/admin/categories');
        }
    }, [error, deleteError, isDeleted]);

    const deleteCategory = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/category/${id}`, config);

            setIsDeleted(data.success);
            setLoading(false);
        } catch (error) {
            setDeleteError(error.response.data.message);
        }
    };

    const categoriesList = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Description',
                    field: 'description',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: [],
        };

        if (!categories || categories.length === 0) {
            return data;
        }

        categories.forEach((category) => {
            data.rows.push({
                id: category._id,
                name: category.name,
                description: category.description,
                actions: (
                    <Fragment>
                        <Link to={`/admin/category/${category._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <Link to={`/admin/categor/${category._id}`} className="btn btn-primary py-1 px-2">
                        <i class="fa-regular fa-eye"></i>
                     </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteCategoryHandler(category._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                ),
            });
        });

        return data;
    };

    const deleteCategoryHandler = (id) => {
        deleteCategory(id);
    };

    return (
        <Fragment>
            <MetaData title={'All Categories'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Categories</h1>

                        {loading ? <Loader /> : <MDBDataTable data={categoriesList()} className="px-3" bordered striped hover />}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default CategoriesList;
