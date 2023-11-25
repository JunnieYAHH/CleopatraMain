import React from 'react'

const ListReviews = ({ reviews }) => {
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

                    {/* Display review images */}
                    <div className="review-images" style={{ display: 'flex' }}>
                        {review.reviewImages.map(image => (
                            <img key={image.reviewPublic_id} src={image.reviewUrl} alt="Review" className="review-image" style={{ marginRight: '10px' }} />
                        ))}
                    </div>

                    <hr />
                </div>
            ))}

        </div>
    )

}



export default ListReviews