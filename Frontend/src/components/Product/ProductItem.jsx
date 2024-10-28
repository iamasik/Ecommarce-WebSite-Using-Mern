import {Link} from 'react-router-dom'
import Rating from 'react-star-ratings'

function ProductItem({product}) {
    return (
        <div className="col-sm-12 col-md-6 col-lg-3 my-3">
        <div className="card p-3 rounded">
          <img
            className="card-img-top mx-auto"
            src={product.images[0].url}
            alt=""
          />
          <div className="card-body ps-3 d-flex justify-content-center flex-column">
            <h5 className="card-title">
              <Link to={`/SingleProduct/${product._id}`}>{product?.name}</Link>
            </h5>
            <div className="ratings mt-auto d-flex">
              <div className="star-ratings">
                <Rating 
                numberOfStars={5}
                starDimension="24px"
                starRatedColor="#fa9c23"
                starSpacing="0px"
                rating={product.ratings}

                />
              </div>
              <span id="no_of_reviews" className="pt-2 ps-2">
                {" "}
                ({product.numOfReviews}){" "}
              </span>
            </div>
            <p className="card-text mt-2">৳ {product.price}</p>
            <Link to={`/SingleProduct/${product._id}`} id="view_btn" className="btn btn-block">View Details</Link>
          </div>
        </div>
      </div>
    )
}

export default ProductItem
