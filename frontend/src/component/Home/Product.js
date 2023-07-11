import React from 'react'
import { Link } from 'react-router-dom'
import ReactStars from "react-rating-stars-component";


const options = {
  edit: false,
  value: 4,
  size: window.innerWidth < 600 ? 20 : 25,
  isHalf: true,
  color: "rgba(20, 20, 20, 0.1)",
  activeColor: "tomato"
};


const Product = ({ product }) => {
  return (
    <Link className='productCard' to={product._id}>
      {product.images && product.images.length > 0 && (
        <img
          className='productCard__image'
          src={product.images[0].url}
          alt={product.name}
        />
      )}
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} /> <span>(256 Reviews)</span>
      </div>
      <span>{product.price}</span>
    </Link>
  );
};


export default Product