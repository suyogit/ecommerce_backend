import React, { Fragment } from 'react'
import { CgMouse } from 'react-icons/cg'
import "./Home.css"
import Product from './Product'

const product =
{
  _id: 1,
  name: "Product 1",
  price: 100,
  images: [
    { url: "https://i.ibb.co/VLFdW3X/1.jpg" },

    // Add more image links here
  ]


}


const Home = () => {
  return (
    <Fragment>

      <div className="banner">
        <p>Welcome to Ecommerce </p >
        <h1>FIND AWESOME PRODUCTS BELOW</h1>



        <a href="#container"><button>
          Scroll <CgMouse />
        </button>  </a>

      </div>
      <h2 className="homeHeading"> Featured Products</h2>
      <div className="container" id="container">
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
      </div>
    </Fragment>
  )
}

export default Home