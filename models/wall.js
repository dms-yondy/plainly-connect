const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wallSchema = new Schema({
  title: {
    type: Number,
    required: true,
  },
  wall: {
    type: Array,
    required: true,
  },
});

const Wall = mongoose.model("Wall", wallSchema);
module.exports = Wall;
