const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors')

app.use(express.json());


// Import all Routes
const products = require('./routes/product')
const user = require('./routes/user')


app.use('/api/v1', products);
app.use('/api/v1', user);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app