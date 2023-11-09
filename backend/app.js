const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')
const cors = require('cors')
const errorMiddleware = require('./middlewares/errors')

app.use(express.json());
app.use(cookieParser());
app.use(cors())


// Import all Routes
const products = require('./routes/product')
const user = require('./routes/user')
const order = require('./routes/order')


app.use('/api/v1', products);
app.use('/api/v1', user);
app.use('/api/v1', order);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app