const User = require("../models/user");


const getMacroSplit = (dailyCalories, goal) => {
  let proteinPct, fatPct, carbPct;

  if (goal === "muscle_gain") {
    proteinPct = 0.30; fatPct = 0.25; carbPct = 0.45;
  } else if (goal === "weight_loss") {
    proteinPct = 0.35; fatPct = 0.25; carbPct = 0.40;
  } else {
    proteinPct = 0.25; fatPct = 0.25; carbPct = 0.50;
  }

  const proteinCalories = dailyCalories * proteinPct;
  const fatCalories = dailyCalories * fatPct;
  const carbCalories = dailyCalories * carbPct;

  return {
    proteinGrams: Math.round(proteinCalories / 4),
    fatGrams: Math.round(fatCalories / 9),
    carbGrams: Math.round(carbCalories / 4)
  };
};


const getMeals = (dietType, goal) => {
  const base = {
    breakfast: "Oats + fruits + nuts",
    lunch: "Rice + dal + vegetables",
    dinner: "Chapati + sabzi"
  };

  if (dietType === "non-veg") {
    base.lunch = "Rice + chicken + vegetables";
    base.dinner = "Chapati + eggs/chicken";
  }

  if (dietType === "vegan") {
    base.breakfast = "Oats + almond milk + seeds";
    base.lunch = "Rice + dal + tofu";
    base.dinner = "Chapati + vegetables + soy chunks";
  }


  if (goal === "muscle_gain") {
    base.snacks = "Peanut butter / protein shake";
  } else if (goal === "weight_loss") {
    base.snacks = "Fruits / boiled chana";
  } else {
    base.snacks = "Mixed nuts / yogurt";
  }

  return base;
};

exports.getDietPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.dailyCalories) {
      return res.status(400).json({
        message: "Please complete profile first"
      });
    }

    const macros = getMacroSplit(user.dailyCalories, user.goal);
    const meals = getMeals(user.dietType, user.goal);

    res.json({
      calories: user.dailyCalories,
      macros,
      meals
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};