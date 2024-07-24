const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    date: Date,
    activitiyTitle: String,
    activityParagraph: String,
    images: [
        {
            imageUrl: { type: String, required: true },
            originalFilename: { type: String, required: true }
        }
    ],
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
