import React from 'react'
import { Link } from 'react-router-dom'
import ReactStars from "react-rating-stars-component";



const ProductCard = ({ product }) => {


  const options = {
    edit: false,
    value: product.ratings,
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "tomato"
  };


  return (
    <Link className='productCard' to={`/product/${product._id}`}>
      {product.images && product.images.length > 0 && (
        <img
          className='productCard__image'
          src={product.images[0].url}
          alt={product.name}
        />
      )}
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} /> <span>({product.numOfReviews}) Reviews</span>
      </div>
      <span>{`रु${product.price}`}</span>
    </Link>
  );
};


export default ProductCard