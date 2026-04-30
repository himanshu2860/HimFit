const { getFoodNutrition } = require("../services/ai.service")
const Food = require("../models/food.model")
exports.analyzeFood = async (req, res) => {
  try {
    const { food } = req.body

    if (!food) {
      return res.status(400).json({
        message: "Food input is required"
      })
    }

   
    const result = await getFoodNutrition(food)

   
    const savedFood = await Food.create({
      foodText: food,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
        fat: result.fat,
        user: req.user.id
    })

    res.status(200).json({
        message: "Food analyzed & saved",
         aiMessage: result.message,
      data: savedFood
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server error"
    })
  }
}
exports.getAllFoods = async (req, res) => {
  try {
   const foods = await Food.find({ user: req.user.id })
  .sort({ createdAt: -1 })

    res.status(200).json({
      count: foods.length,
      data: foods
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Server error"
    })
  }
}
exports.getDailySummary = async (req, res) => {
  try {
    const now = new Date()

const start = new Date(now.setHours(0, 0, 0, 0))
const end = new Date(now.setHours(23, 59, 59, 999))

    const foods = await Food.find({
      user: req.user.id,
      createdAt: { $gte: start, $lte: end }
    })

    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0

    foods.forEach(food => {
      totalCalories += food.calories || 0
      totalProtein += food.protein || 0
      totalCarbs += food.carbs || 0
      totalFat += food.fat || 0
    })

    const calorieGoal = 2500

const goalProgress = Math.min(
  Math.round((totalCalories / calorieGoal) * 100),
  100
)

   res.json({
  date: new Date().toISOString().split("T")[0],
  dayName: new Date().toLocaleDateString("en-US", { weekday: "long" }),

  totalItems: foods.length,

  totalCalories: Math.round(totalCalories),
  totalProtein: Math.round(totalProtein),
  totalCarbs: Math.round(totalCarbs),
     totalFat: Math.round(totalFat),
  
     goalProgress
})

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" })
  }
}
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params

    const food = await Food.findOneAndDelete({
      _id: id,
      user: req.user.id
    })

    if (!food) {
      return res.status(404).json({ message: "Food not found" })
    }

    res.json({ message: "Food deleted successfully" })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" })
  }
}
