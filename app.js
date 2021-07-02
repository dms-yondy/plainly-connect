const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Wall = require("./models/wall");
const app = express();

dotenv.config();
app.set("view engine", "ejs");

const dbURI = process.env.dbURI;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen("3000"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.get("/walls", (req, res) => {
  res.render("index");
});

app.get("/walls/:id", async (req, res) => {
  const id = req.params.id;
  await Wall.find({ title: parseInt(id) }).then((result) => {
    res.render("wall", { data: result });
  });
});

app.use((req, res) => {
  res.status(404).render("404");
});
