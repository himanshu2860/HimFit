const express = require("express");
const router = express.Router();

const { getWorkoutPlan } = require("../controllers/workout.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/plan", authUser, getWorkoutPlan);

module.exports = router;