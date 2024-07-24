const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    age: Number,
    number: Number,
    email: String,
    address: String,
    photo: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
