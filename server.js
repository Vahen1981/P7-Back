const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const checkoutRouter = require('./routes/checkoutRoutes');

const port = process.env.PORT || 3000;

connectDB();

app.use(cors())
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/checkout', checkoutRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
