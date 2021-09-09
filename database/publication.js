const mongoose = require("mongoose");

// publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

// creating publication model
const PublicationModel = mongoose.model(PublicationSchema);

module.exports = PublicationModel;