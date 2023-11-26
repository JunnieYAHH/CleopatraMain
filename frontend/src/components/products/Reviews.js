import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'


const ListReviews = ({ reviews, prod }) => {

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewedId, setSelectedReview] = useState('');
    const [reviewImages, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('');
    console.log(user.name)
    const navigate = useNavigate();


    const [updateCounter, setUpdateCounter] = useState(0);


    const CurrentUserReviews = (reviewId) => {
        const selectedReview = reviews.find((review) => review._id === reviewId);

        if (selectedReview) {
            const { _id, name, rating, comment, reviewImages } = selectedReview;
            console.log('Review User:', _id);

            setSelectedReview(_id);
            setRating(rating);
            setComment(comment);
            setImages(reviewImages);
        } else {
            console.error(`Review with ID ${reviewId} not found.`);
        }
    };


    function setUserRatings() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.starValue = index + 1;
            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })
        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');
                        setRating(this.starValue)
                    } else {
                        star.classList.remove('orange')
                    }
                }
                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow')
                    }
                }
                if (e.type === 'mouseout') {
                    star.classList.remove('yellow')
                }
            })
        }
    }

    const handlePencilClick = () => {
        setUserRatings();
        CurrentUserReviews(reviews._id);
    };


    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    const updateReview = async (reviewData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/update/review/${prod}/${reviewedId}`, reviewData, config);
            setSuccess(data.success);
        } catch (error) {
            setErrorReview(error.response.data.message);
        }
    };

    const closeModal = () => {
        setUpdateCounter((prevCounter) => prevCounter + 1);
    };

    const resetStateAfterSubmission = () => {
        setRating(0);
        setComment('');
        setImages([]);
        setImagesPreview([]);
    };


    const updateReviewHandler = () => {
        const formData = new FormData();
        console.log(user)
        formData.set('user', user._id);
        formData.set('name', user.name);
        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('_id', reviewedId);
        reviewImages.forEach((image) => {
            formData.append('images', image);
        });

        updateReview(formData);

        closeModal();
        resetStateAfterSubmission();

        navigate(`/product/${prod}`)
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

    return (
        <div class="reviews w-75">

            <h3>Other's Reviews:</h3>
            <hr />
            {reviews && reviews.map(review => (
                <div key={review._id} className="review-card my-3">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(review.rating / 5) * 100}%` }}></div>
                    </div>
                    <p className="review_user">by {review.name}</p>
                    <p className="review_comment">{review.comment}</p>

                    <div className="review-images" style={{ display: 'flex' }}>
                        {review.reviewImages.map(image => (
                            <img key={image.reviewPublic_id} src={image.reviewUrl} alt="Review" className="review-image" style={{ marginRight: '10px' }} />
                        ))}
                    </div>
                    {user && user.name === review.name && (
                        <Link to="" className="py-1 px-2">
                            <button className="fa fa-pencil" data-toggle="modal" data-target="#updateRatingModal"
                                onClick={() => { setUserRatings(review); CurrentUserReviews(review._id); }}>

                            </button>
                        </Link>
                    )}
                    <hr />
                </div>
            ))}

            <div className="modal fade" id="updateRatingModal" tabIndex="-1" role="dialog" aria-labelledby="updateRatingModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: 'black', color: 'white'}}>
                            <h5 className="modal-title" id="updateRatingModalLabel">Update Review</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body"  style={{ backgroundColor: 'gray' }}>
                            <ul className="stars" >
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                            </ul>
                            <textarea
                                name="review"
                                id="review" className="form-control mt-3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <form encType='multipart/form-data'>
                                <div className='form-group'>
                                    <label>Images</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                        </label>
                                    </div>

                                    {imagesPreview.map((img, index) => (
                                        <img
                                            src={img}
                                            key={index}
                                            alt={`Images Preview ${index + 1}`}
                                            className='mt-3 mr-2'
                                            width='55'
                                            height='52'
                                        />
                                    ))}
                                </div>

                                <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" onClick={updateReviewHandler}>
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}



export default ListReviews