const Product = require('../models/products');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const product = require('../data/product');
const { connect } = require('mongoose');

dotenv.config({path: 'backend/config/config.env'})

connectDatabase();

const seedProducts = async () => {
    try {

        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(product);  
        console.log('All products are added.');

        process.exit();

    } catch(erro) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts();