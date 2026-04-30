const express = require("express");
const router = express.Router();

const { askFitnessCoach } = require("../services/ai.service");
const User = require("../models/user");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/ask", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    if (!user.heightCm || !user.weightKg || !user.goal) {
      return res.json({
        reply:
          " Oye! Pehle profile complete kar. Height, weight, goal daal — tabhi proper guidance milegi."
      });
    }

    const reply = await askFitnessCoach(user, message);

    res.json({ reply });

  } catch (err) {
    console.log("AI Route Error:", err);
    res.status(500).json({ message: "AI error" });
  }
});

module.exports = router;