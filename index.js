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

app.use(
    cors({
        origin: process.env.URL ? process.env.WEBSITE_URL : "*",
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json("Server is running");
});

app.post("/add/users", (req, res) => {
    UserModel.create(req.body)
        .then(res.json("Subscribed"))
        .catch((err) => res.json(err));
});

app.get("/fetch/items", (req, res) => {
    ItemModel.find({})
        .then((items) => res.json(items))
        .catch((err) => res.json(err));
});

app.post("/add/items", (req, res) => {
    const id = req.body.id;
    ItemModel.findOne({ id: id })
        .then((item) => {
            if (item) {
                res.json("Already in cart!");
            } else {
                ItemModel.create(req.body)
                    .then(res.json("Item added successfully."))
                    .catch((err) => res.json(err));
            }
        })
        .catch((err) => res.json(err));
});

app.put("/update/items/:id", (req, res) => {
    const id = req.params.id;
    ItemModel.findByIdAndUpdate({ _id: id }, { count: req.body.count })
        .then(res.json("Item updated successfully."))
        .catch((err) => res.json(err));
});

app.delete("/delete/items/:id", (req, res) => {
    const id = req.params.id;
    ItemModel.findByIdAndDelete({ _id: id })
        .then(res.json("Item deleted successfully."))
        .catch((err) => res.json(err));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
