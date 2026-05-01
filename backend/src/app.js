const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
const allowedOrigins = [
  "https://him-fit.vercel.app",  
  "http://localhost:5173"        
];

app.use(cors())

const authRoutes = require("./routes/auth.routes")
const foodRoutes = require("./routes/food.routes")
const userRoutes = require("./routes/user.routes")
const dietRoutes = require("./routes/diet.routes")
const workoutRoutes = require("./routes/workout.routes");
const aiRoutes = require("./routes/ai.routes");

app.use("/api/ai", aiRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/diet", dietRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

app.use("/api/food", foodRoutes)

module.exports = app  