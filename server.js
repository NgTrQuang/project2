const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// const productRouter = require('./routers/productRouter'); // Import router
const authRouter = require('./routers/authRouter'); // Import router
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const favoriteRoter = require('./routers/favoriteRoter');
const cartRouter = require('./routers/cartRouter');
const orderRouter = require('./routers/orderRouter');
const paymentRouter = require('./routers/paymentRouter');
const categoryRouter = require('./routers/categoryRouter');
const statisticsRouter = require('./routers/statisticsRouter');

app.use(cors());
// Middleware để parse JSON body
app.use(express.json());

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/database1')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Sử dụng các route đã định nghĩa trong productRouter
app.use('/api', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/favorites', favoriteRoter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/statistics', statisticsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
