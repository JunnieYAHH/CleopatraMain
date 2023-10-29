const mongoose = require('mongoose');


const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewURLParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log(`MongoDB database connected to HOST: ${con.connection.host}`)
    })
}

module.exports = connectDatabase