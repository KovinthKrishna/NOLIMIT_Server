const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    id: Number,
    count: Number,
});

const ItemModel = mongoose.model("items", ItemSchema);
module.exports = ItemModel;
