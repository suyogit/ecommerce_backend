
import React, { Fragment, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import './ProductDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetails, clearErrors } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import ReactStars from 'react-rating-stars-component';
import ReviewCard from './ReviewCard.js';
import { useAlert } from 'react-alert';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { product, loading, error } = useSelector((state) => state.productDetails);

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }


        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert]);



    const options = {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: product.ratings,
        isHalf: true,
    };


    if (!product) {
        return <div>  <Loader /> </div>;
    }

    return (
        <Fragment>
            {
                loading ? <Loader /> : (
                    <Fragment>
                        <div className="ProductDetails">
                            {/* <div style={{ width: 400, marginLeft: "300px" }}> */}
                            <div >
                                <Carousel>
                                    {product.images &&
                                        product.images.map((item, i) => (
                                            <img
                                                className="CarouselImage"
                                                src={item.url}
                                                alt={`${i} Slide`}
                                                key={item.url}
                                            // height={window.innerWidth < 600 ? 100 : 400}
                                            // width={window.innerWidth < 600 ? 300 : 300}






                                            />
                                        ))}
                                </Carousel>
                            </div>

                            <div>
                                <div className="detailsBlock-1">
                                    <h2>{product.name}</h2>
                                    <p>Product # {product._id}</p>
                                </div>
                                <div className="detailsBlock-2">
                                    <ReactStars {...options} />
                                    <span className="detailsBlock-2-span">
                                        {" "}
                                        ({product.numOfReviews} Reviews)
                                    </span>
                                </div>
                                <div className="detailsBlock-3">
                                    <h1>{`₹${product.price}`}</h1>
                                    <div className="detailsBlock-3-1">
                                        <div className="detailsBlock-3-1-1">
                                            <button>-</button>
                                            <input type="number" value="1" />
                                            <button>+</button>
                                        </div>
                                        <button
                                            disabled={product.Stock < 1 ? true : false}

                                        >
                                            Add to Cart
                                        </button>
                                    </div>

                                    <p>
                                        Status:{""}
                                        <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                            {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                        </b>
                                    </p>
                                </div>

                                <div className="detailsBlock-4">
                                    Description : <p>{product.description}</p>
                                </div>

                                <button className="submitReview">
                                    Submit Review
                                </button>
                            </div>
                        </div>
                        <h3 className='reviewsHeading'>Reviews</h3>

                        {product.reviews && product.reviews[0] ? (
                            <div className="reviews">
                                {product.reviews &&
                                    product.reviews.map((review) => (
                                        <ReviewCard key={review._id} review={review} />
                                    ))}
                            </div>
                        ) : (
                            <p className="noReviews">No Reviews Yet</p>
                        )}

                    </Fragment>
                )
            }
        </Fragment>
    );
};

export default ProductDetails;



// import React, { Fragment, useEffect } from "react";
// import Carousel from "react-material-ui-carousel";
// import "./ProductDetails.css";
// import { useSelector, useDispatch } from "react-redux";
// import { clearErrors, getProductDetails } from "../../actions/productAction";
// import { useLocation, useParams } from "react-router-dom";
// import ReactStars from "react-rating-stars-component";
// //import ReviewCard from "./ReviewCard.js";
// import Loader from "../layout/Loader/Loader";
// import { useAlert } from "react-alert";

// const ProductDetails = () => {
//     const dispatch = useDispatch();
//     const alert = useAlert();
//     const location = useLocation();
//     const { id } = useParams();
//     const { product, loading, error } = useSelector(
//         (state) => state.productDetails
//     );
//     useEffect(() => {
//         //console.log(match);
//         // const id = location.pathname.split("/")[2];
//         if (error) {
//             alert.error(error);
//             dispatch(clearErrors());
//         }
//         dispatch(getProductDetails(id));
//     }, [dispatch]);

//     const options = {
//         edit: false,
//         color: "rgba(20,20,20,0.1)",
//         activeColor: "tomato",
//         size: window.innerWidth < 600 ? 20 : 25,
//         value: product.ratings,
//         isHalf: true,
//     };

//     return (
//         <Fragment>
//             {loading ? (
//                 <Loader />
//             ) : (
//                 <Fragment>
//                     <div className="ProductDetails">
//                         <div>
//                             <Carousel>
//                                 {product.images &&
//                                     product.images.map((item, i) => {
//                                         console.log(item.url);
//                                         return (
//                                             <img
//                                                 src={item.url}
//                                                 alt={`${i} Slide`}
//                                                 className="CarouselImage"
//                                                 key={item.url}
//                                             />
//                                         );
//                                     })}
//                             </Carousel>
//                         </div>

//                         <div>
//                             <div className="detailsBlock-1">
//                                 <h2>{product.name}</h2>
//                                 <p>Product #{product._id}</p>
//                             </div>

//                             <div className="detailsBlock-2">
//                                 <ReactStars {...options} />
//                                 <span> ({product.numberOfReviews} Reviews)</span>
//                             </div>
//                             <div className="detailsBlock-3">
//                                 <h1>{`$${product.price}`}</h1>
//                                 <div className="detailsBlock-3-1">
//                                     <div className="detailsBlock-3-1-1">
//                                         <button>-</button>
//                                         <input type="number" value="1" />
//                                         <button>+</button>
//                                     </div>{" "}
//                                     <button>Add to Cart</button>
//                                 </div>
//                                 <p>
//                                     Status:
//                                     <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
//                                         {product.Stock < 1 ? "OutOfStock" : "InStock"}
//                                     </b>
//                                 </p>
//                             </div>
//                             <div className="detailsBlock-4">
//                                 Description: <p>{product.description}</p>
//                             </div>
//                             <button className="submitReview">Submit Review</button>
//                         </div>
//                     </div>
//                     <h3 className="reviewsHeading">REVIEWS</h3>
//                     {product.reviews && product.reviews[0] ? (
//                         <div className="reviews">
//                             {product.reviews &&
//                                 product.reviews.map((review) => {
//                                     // return <ReviewCard review={review} />;
//                                     return <h1>Review</h1>
//                                 })}
//                         </div>
//                     ) : (
//                         <p className="noReviews">No Reviews Yet</p>
//                     )}
//                 </Fragment>
//             )}
//         </Fragment>
//     );
// };

// export default ProductDetails;