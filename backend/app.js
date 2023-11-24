const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorMiddleware = require('./middlewares/errors')
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(express.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit : '50mb', extended: true }));
app.use(cookieParser());
app.use(fileUpload());
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