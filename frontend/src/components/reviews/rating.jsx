import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

function Rating() {
  const { filterby } = useParams();
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productList);
  const productDisplay = productData.filter((el) => el._id === filterby)[0];
  const [reviewsData, setReviewsData] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentValue, setCurrentValue] = useState(0);
  const stars = Array(5).fill(0);

  const setRatingByPercentage = (percentage) => {
    const numStars = Math.ceil((percentage / 100) * 5);
    setCurrentValue(numStars);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/api/getreview/${productDisplay._id}`
        );
        setReviewsData(response.data);
        console.log("review data", response.data);
        setReviewsLoading(false);
      } catch (error) {
        setReviewsError(error.message);
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productDisplay._id]);

  useEffect(() => {
    // Calculate the rating based on positive and negative decisions
    const positiveDecisions = reviewsData.filter(
      (review) => review.decition === "positive"
    ).length;
    const totalDecisions = reviewsData.length;
    const rating = (positiveDecisions / totalDecisions) * 100;

    // Update the rating percentage
    setRatingByPercentage(rating);
  }, [reviewsData]);

  const getStarColor = (index) => {
    return currentValue > index ? colors.orange : colors.grey;
  };

  return (
    <div>
      <div className="flex">
        {stars.map((_, index) => {
          return (
            <div key={index}>
              <FaStar size={20} color={getStarColor(index)} className="mr-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Rating;
