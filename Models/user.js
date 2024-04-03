const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    address: String,
    age: Number,
    number: Number,
    email: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
