// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function Analysis() {
//   const [data, setData] = useState({ positive: 0, negative: 0, reviews: [] });
//   const [inputText, setInputText] = useState("");
  

//   const fetchData = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:5000/anaysys"); // Updated URL
//       setData(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append("text", inputText);

//       const response = await axios.post("http://127.0.0.1:5000/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data", // Use 'multipart/form-data' for FormData
//         },
//       });
//       setData(response.data);
//       setInputText("");
//     } catch (error) {
//       console.error("Error submitting data:", error);
//     }
//   };

//   return (
//     <div>
//       <div>
//         <h2>Positive Sentiments: {data.positive}</h2>
//         <h2>Negative Sentiments: {data.negative}</h2>
//       </div>
//       <div>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             name="text"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//           ></textarea>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//       <div>
//         <h2>Reviews</h2>
//         {data.reviews.map((review, index) => (
//           <div key={index}>
//             <p>{review.text}</p>
//             <p>Sentiment: {review.sentiment}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Analysis;
