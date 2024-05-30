const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const UserModel = require("./models/Users");
const ItemModel = require("./models/Items");

const localURL = "mongodb://localhost:27017/nolimit";

mongoose.connect(process.env.URL ?? localURL);

const PORT = 3000;
const app = express();
app.use(cors());

app.use(express.json());

app.post("/api/users", (req, res) => {
    UserModel.create(req.body)
        .then((users) => res.json(users))
        .catch((err) => res.json(err));
});

app.get("/", (req, res) => {
    ItemModel.find({})
        .then((items) => res.json(items))
        .catch((err) => res.json(err));
});

app.post("/add/items", (req, res) => {
    ItemModel.create(req.body)
        .then((items) => res.json(items))
        .catch((err) => res.json(err));
});

app.put("/update/items/:id", (req, res) => {
    const id = req.params.id;
    ItemModel.findByIdAndUpdate({ _id: id }, { count: req.body.count })
        .then((items) => res.json(items))
        .catch((err) => res.json(err));
});

app.delete("/delete/items/:id", (req, res) => {
    const id = req.params.id;
    ItemModel.findByIdAndDelete({ _id: id })
        .then((items) => res.json(items))
        .catch((err) => res.json(err));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});