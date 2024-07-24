const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    // username: {
    //     type: String,
    //     required: true,
    // },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
