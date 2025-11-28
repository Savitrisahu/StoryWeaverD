const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    content: String,
    likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Story', storySchema);
