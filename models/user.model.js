const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {    
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters long']    // this mssg shows when length < 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [5, 'Email must be at least 5 characters long']    // this mssg shows when length < 5
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'Password must be at least 6 characters long']    // this mssg shows when length < 6
    }
});

module.exports = mongoose.model('user', user);