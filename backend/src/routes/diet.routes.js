const express = require("express");
const router = express.Router();

const { getDietPlan } = require("../controllers/diet.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.get("/plan", authUser, getDietPlan);

module.exports = router;