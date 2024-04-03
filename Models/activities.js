const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    imageUrl: String,
    date: Date,
    title: String,
    content: String
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
