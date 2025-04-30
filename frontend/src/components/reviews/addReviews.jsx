import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";

const AddReview = () => {
  const { filterby } = useParams();
  const dispatch = useDispatch();
  const userInfoString = useSelector((state) => state.auth.userInfo);
  const productData = useSelector((state) => state.product.productList);
  const productDisplay = productData.filter((el) => el._id === filterby)[0];
  const userInfo =
    typeof userInfoString === "string"
      ? JSON.parse(userInfoString)
      : userInfoString || {};
  const [data, setData] = useState({ positive: 0, negative: 0, review: null });
  const [inputText, setInputText] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/analysis");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("text", inputText);
      const response = await axios.post("http://127.0.0.1:5000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(response.data);
      console.log("first", response.data);
      setInputText("");
      const secondFormData = {
        decition: response.data.decision,
        comment: response.data.review ? response.data.review.text : "",
        product_id: productDisplay._id,
        cus_id: userInfo._id,
        cus_name: userInfo.firstName,
        cus_image: userInfo.image,
        seller_id: productDisplay.seller_id,
      };
      const secondResponse = await axios.post(
        "http://localhost:8082/api/review",
        secondFormData
      );
      console.log("Second", secondResponse.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Container sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "50%", mt: "50px" }}>
        <Typography sx={{ fontWeight: "bold" }} variant="h4" gutterBottom>
          Add Review
        </Typography>
        <Typography sx={{}} variant="h6" gutterBottom>
          Give your Review....
        </Typography>
        <form
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", mb: 4 }}
        >
          <TextField
            label="Write your review"
            multiline
            rows={4}
            variant="outlined"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ mb: 5, width: "100%" }}
          />
          <Button type="submit" variant="contained" color="primary">
            Give Review
          </Button>
        </form>
      </Box>
      <Box sx={{ width: "40%", display: "flex", justifyContent: "center" }}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVrOVZrLkJsOx_Ys9UTr5hzN4WJBv8n7YjH-TEPeH-XpHAAhxLSRA0gCj9UFIo4CWwbO4&usqp=CAU"
          alt="Product Image"
          style={{ maxWidth: "100%", maxHeight: "400px" }}
        />
      </Box>
    </Container>
  );
};

export default AddReview;
