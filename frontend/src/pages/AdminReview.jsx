import React, { useState, useEffect } from "react";
import { TiWarning } from "react-icons/ti";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const colors = {
  orange: "#FB021C",
  grey: "#a9a9a9",
};

const SellerPage = () => {
  const [sellers, setSellers] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSellers() {
      try {
        const response = await axios.get(
          "http://localhost:8082/api/getadminsellers"
        );
        setSellers(response.data);
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    }

    fetchSellers();
  }, []);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:8082/api/review`);
        setReviewsData(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    fetchReviews();
  }, []);

  const getReviewDecisions = (sellerId) => {
    const sellerReviews = reviewsData.filter(
      (review) => review.seller_id === sellerId
    );
    const decisions = sellerReviews.map((review) => review.decition);
    return decisions;
  };

  const calculateRating = (decisions) => {
    const negativeCount = decisions.filter(
      (decision) => decision === "negative"
    ).length;
    const totalDecisions = decisions.length;
    if (totalDecisions === 0) {
      return 0;
    }
    const percentage = (negativeCount / totalDecisions) * 100;
    if (percentage <= 20) {
      return 1;
    } else if (percentage <= 40) {
      return 2;
    } else if (percentage <= 60) {
      return 3;
    } else if (percentage <= 80) {
      return 4;
    } else {
      return 5;
    }
  };

  const renderStars = (rating) => {
    const starComponents = [];
    for (let i = 0; i < 5; i++) {
      starComponents.push(
        <TiWarning
          key={i}
          size={30}
          color={rating > i ? colors.orange : colors.grey}
        />
      );
    }
    return starComponents;
  };

  const handleWarningClick = (seller) => {
    setSelectedSeller(seller);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isWarning = (rating) => {
    return rating >= 4;
  };

  const sendEmail = async () => {
    try {
      await axios.post("http://localhost:8082/api/admin/sendEmail", {
        email: selectedSeller.email,
        description: description,
      });

      setOpen(false);
      navigate("/adminReview");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Seller Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review Decisions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.map((seller, index) => (
              <TableRow key={index}>
                <TableCell>
                  {seller.firstName} {seller.lastName}
                </TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>
                  <div className="flex">
                    {renderStars(
                      calculateRating(getReviewDecisions(seller._id))
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleWarningClick(seller)}
                    sx={{
                      bgcolor: isWarning(
                        calculateRating(getReviewDecisions(seller._id))
                      )
                        ? colors.orange
                        : "#023BFB",
                      "&:hover": {
                        bgcolor: isWarning(
                          calculateRating(getReviewDecisions(seller._id))
                        )
                          ? colors.orange
                          : "#E72929",
                      },
                      color: "white",
                    }}
                  >
                    Warning
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            id="outlined-basic"
            label="Seller Email"
            variant="outlined"
            defaultValue={selectedSeller ? selectedSeller.email : ""}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button variant="contained" onClick={sendEmail}>
            Send
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default SellerPage;
