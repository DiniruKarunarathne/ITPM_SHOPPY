import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios"; 
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Reviews = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { filterby } = useParams();
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productList);
  const productDisplay = productData.filter((el) => el._id === filterby)[0];
  const [reviewsData, setReviewsData] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/api/getreview/${productDisplay._id}`
        );
        setReviewsData(response.data);
        console.log("sacascasc", response.data);
        setReviewsLoading(false);
      } catch (error) {
        setReviewsError(error.message);
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productDisplay._id]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index) => setActiveIndex(index),
  };

  return (
    <div className="w-[350px] bg-blue-200 hover:shadow-lg drop-shadow-lg py-5 px-4 cursor-pointer flex flex-col mx-auto rounded-3xl">
      {reviewsLoading ? (
        <p>Loading reviews...</p>
      ) : reviewsError ? (
        <p>Error loading reviews: {reviewsError}</p>
      ) : (
        <Slider {...settings}>
          {reviewsData.map((review, index) => (
            <div key={index}>
              <div className="mb-2 mt-6 flex justify-center">
                <img
                  src={review.cus_image}
                  className="h-20 w-20 rounded-full shadow-lg dark:shadow-black/30"
                  alt="sample image"
                />
              </div>
              <p className="mx-auto max-w-4xl text-sm italic text-black">
                {review.comment}
              </p>

              <p className="text-black font-bold italic">- {review.cus_name}</p>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Reviews;
