const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(" Connected to Database");
  } catch (err) {
    console.error(" DB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectToDB;