<<<<<<< HEAD
const authRouter = require("./routes/auth.router.js");
// const router = require("./routes/sellerRoute.js");
=======

const router = require("./routes/sellerRoute.js");
>>>>>>> b730af62a49f8f4bd0fee3310cc3a538cbd39c75
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 5000;

// use middleware
// use middleware
app.use(
  cors({
<<<<<<< HEAD
    origin: "*", // Change this to the origin of your frontend application
=======

    origin: "http://localhost:3000",
>>>>>>> b730af62a49f8f4bd0fee3310cc3a538cbd39c75
    // origin: 'http://localhost:3001',
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

// mongodb connection
const con = require("./db/connection.js");

<<<<<<< HEAD
// using routes
//authentication route
app.use(authRouter);
// app.use("/api/seller", require("./routes/sellerRoute.js"));
// app.use("/api/admin", require("./routes/adminReview.Route.js"));


app.use("/api/contactus", require("./routes/contactus.router.js"));

app.use(require("./routes/contactus.router.js"));


// app.use(require("./routes/cart.router.js"));
// app.use(require("./routes/review.route.js"));
// app.use(require("./routes/payment.route.js"));
// app.use(require("./routes/adminReview.Route.js"));


// app.use("/api/admin", require("./routes/adminRoute.js"));

// app.use("/api/item", require("./routes/itemsRoute.js"));

=======
app.use(require("./routes/cart.router.js"));
app.use(require("./routes/payment.route.js"));
app.use("/api/item", require("./routes/itemsRoute.js"));
app.use("/api/seller", require("./routes/sellerRoute.js"));


>>>>>>> b730af62a49f8f4bd0fee3310cc3a538cbd39c75

con
  .then((db) => {
    if (!db) return process.exit(1);

    // listen to the http server
    const server = app.listen(port, () => {
      console.log(`Server is running on port: http://localhost:${port}`);
    });

    app.on("error", (err) =>
      console.log(`Failed To Connect with HTTP Server : ${err}`)
    );
    // error in mondb connection
  })
  .catch((error) => {
    console.log(`Connection Failed...! ${error}`);
  });
