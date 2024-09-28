require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// const productRouter = require('./routers/productRouter'); // Import router
const authRouter = require('./routers/authRouter'); // Import router
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');

app.use(cors()); // Cho phép CORS cho tất cả các miền

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
