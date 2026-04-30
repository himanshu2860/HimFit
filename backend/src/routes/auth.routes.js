const express = require("express")
const router = express.Router()

const { 
  register, 
  login, 
  logout, 
  verifyOTP, 
  updateGoals

} = require("../controllers/auth.controller")

const { authUser } = require("../middlewares/auth.middleware");



router.post("/register", register)
router.post("/login", login)


router.get("/logout", logout)
router.put("/update-goals", authUser, updateGoals);

module.exports = router