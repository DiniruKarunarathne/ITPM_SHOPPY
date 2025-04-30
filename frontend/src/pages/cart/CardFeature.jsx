import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllCartItems } from "../../services/redux/productSlice";
import { useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  card: {
    width: 300, // Set a fixed width for the card
    height: 400, // Set a fixed height for the card
    cursor: "pointer",
    backgroundColor: "#EEEEEE",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  priceText: {
    color: "#e53935",
    fontWeight: "bold",
  },
});

const CardFeature = ({
  images,
  categories,
  quantity,
  description,
  loading,
  id,
  title,
  price,
  seller_id,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCartItems());
  }, [dispatch]);

  const handleAddCartProduct = (e) => {
    dispatch(
      fetchAllCartItems({
        _id: id,
        images: images,
        categories: categories,
        quantity: quantity,
        description: description,
        title: title,
        price: price,
        seller_id: seller_id,
      })
    );
  };

  return (
    <Card className={classes.card}>
      {price ? (
        <>
          <Link to={`/menu/${id}`}>
            <CardMedia
              className={classes.media}
              image={images[0]}
              // title={title}
            />
            <CardContent>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: "bold", fontSize: "30px" }}
              >
                {title}
              </Typography>
              <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                {categories}
              </Typography>

              <Typography
                sx={{ fontWeight: "bold", fontSize: "20px" }}
                variant="body1"
                color="textSecondary"
              >
                Price : $ {price}
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "20px" }}
                variant="body1"
                className={classes.priceText}
              >
                Available Quanttity : {quantity}
              </Typography>
              <Typography
                sx={{ color: "#222831", fontSize: "20px" }}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
                variant="body1"
                className={classes.priceText}
              >
                {description}
              </Typography>
              {/* <Typography
                sx={{ fontWeight: "bold", fontSize: "30px" }}
                variant="body1"
                className={classes.priceText}
              >
                ${title}
                {seller_id}
              </Typography> */}
            </CardContent>
          </Link>
        </>
      ) : (
        <CardContent>
          <Typography variant="h5" color="error" align="center">
            {loading}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};

export default CardFeature;