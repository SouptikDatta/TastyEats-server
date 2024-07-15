require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 6001;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


//middleware
app.use(cors());
app.use(express.json());

//mongodb configuration using mongoose
mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@foodi-cluster.23d9ebe.mongodb.net/foodi-cluster?retryWrites=true&w=majority`)
  .then(console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// jwt authentication
app.post('/jwt', async(req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr'
  })
  res.send({token});
})


//import routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes');
const paymentRoutes = require('./api/routes/paymentRoutes')
const favoriteRoutes = require('./api/routes/favoriteRoutes')
const adminStats = require('./api/routes/adminStats')
const orderStats = require('./api/routes/orderStats')
app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes)
app.use('/users', userRoutes)
app.use('/payments', paymentRoutes)
app.use('/admin-stats', adminStats)
app.use('/order-stats', orderStats)
app.use('/favorites', favoriteRoutes);



//Stripe payment routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"]
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})