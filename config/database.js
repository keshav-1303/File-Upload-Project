const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to Database'))
    .catch(err => {
        console.error('Database connection failed:', err.message);
        process.exit(1); // stop server if DB connection fails
    });
}

module.exports = connectDB;
