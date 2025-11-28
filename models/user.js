const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    likedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
    readStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }] // add this
});

module.exports = mongoose.model('User', userSchema);
