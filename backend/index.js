const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./Routes/auth.js");
const userRoute = require("./Routes/user.js");
const productRoute = require("./Routes/product.js");
const cartRoute = require('./Routes/cart.js');
const orderRoute = require("./Routes/order.js");
const stripeRoute = require("./Routes/stripe.jsx");
const cors = require("cors");



/*MIDDLEWARE CONFIGURATIONS */
dotenv.config();
app.use(express.json());  // this help the server to accept json data
app.use(cors());



/* Routes*/
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', stripeRoute);



/* SETTING UP DATABASE AND SERVER AND CONNECTIONG THEM */
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URL).then(app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
    console.log("Server is connected with database");
})).catch((err) => {
    console.log(`${err} does not connect`);
})