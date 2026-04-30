const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
  foodText: {
    type: String,
    required: true
  },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Food", foodSchema)