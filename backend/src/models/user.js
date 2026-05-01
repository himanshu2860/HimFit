const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: String,
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
},
 password: {
  type: String,
  required: true
},

  goalCalories: { type: Number, default: 2000 },
  goalProtein: { type: Number, default: 50 },
  goalFat: { type: Number, default: 70 },



  age: Number,
  gender: {
    type: String,
    enum: ["male", "female"]
  },

  heightUnit: {
    type: String,
    enum: ["cm", "feet"],
    default: "cm"
  },

  weightUnit: {
    type: String,
    enum: ["kg", "lbs"],
    default: "kg"
  },

  heightInput: Number,
  weightInput: Number,

  heightCm: Number,
  weightKg: Number,

  activityLevel: {
    type: String,
    enum: ["sedentary", "light", "moderate", "active"]
  },

  goal: {
    type: String,
    enum: ["weight_loss", "muscle_gain", "maintain"]
  },

  dietType: {
    type: String,
    enum: ["veg", "non-veg", "vegan"]
  },

 
  bmi: Number,
  tdee: Number,
  dailyCalories: Number

}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User