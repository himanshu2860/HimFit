const express = require("express")
const router = express.Router()

const { analyzeFood, getAllFoods,getDailySummary, deleteFood } = require("../controllers/food.controller")
const { authUser } = require("../middlewares/auth.middleware")

router.post("/analyze", authUser, analyzeFood)
router.get("/", authUser, getAllFoods)
router.get("/summary", authUser, getDailySummary)
router.delete("/:id", authUser, deleteFood)
module.exports = router