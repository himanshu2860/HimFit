const User = require("../models/user");

const getWorkoutPlan = (goal, level = "beginner") => {

  if (goal === "muscle_gain") {
    return {
      type: "Push Pull Legs Split",
      weeklyPlan: [
        {
          day: "Day 1 - Push (Chest, Shoulders, Triceps)",
          exercises: [
            { name: "Push-ups", sets: 3, reps: "10-15", rest: "60 sec" },
            { name: "Bench Press", sets: 4, reps: "8-12", rest: "90 sec" },
            { name: "Shoulder Press", sets: 3, reps: "8-12", rest: "60 sec" },
            { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "60 sec" }
          ]
        },
        {
          day: "Day 2 - Pull (Back, Biceps)",
          exercises: [
            { name: "Pull-ups", sets: 3, reps: "6-10", rest: "90 sec" },
            { name: "Barbell Row", sets: 4, reps: "8-12", rest: "90 sec" },
            { name: "Bicep Curls", sets: 3, reps: "10-12", rest: "60 sec" }
          ]
        },
        {
          day: "Day 3 - Legs",
          exercises: [
            { name: "Squats", sets: 4, reps: "8-12", rest: "90 sec" },
            { name: "Lunges", sets: 3, reps: "10 each leg", rest: "60 sec" },
            { name: "Leg Press", sets: 3, reps: "10-12", rest: "60 sec" }
          ]
        }
      ]
    };
  }

  if (goal === "weight_loss") {
    return {
      type: "Fat Loss + Cardio",
      weeklyPlan: [
        {
          day: "Day 1 - Full Body",
          exercises: [
            { name: "Jump Rope", sets: 3, reps: "1 min", rest: "30 sec" },
            { name: "Burpees", sets: 3, reps: "10-15", rest: "30 sec" },
            { name: "Push-ups", sets: 3, reps: "10-12", rest: "45 sec" },
            { name: "Squats", sets: 3, reps: "15", rest: "45 sec" }
          ]
        },
        {
          day: "Day 2 - Cardio",
          exercises: [
            { name: "Running", sets: 1, reps: "20-30 min", rest: "-" },
            { name: "Cycling", sets: 1, reps: "15-20 min", rest: "-" }
          ]
        }
      ]
    };
  }


  return {
    type: "General Fitness",
    weeklyPlan: [
      {
        day: "Full Body",
        exercises: [
          { name: "Push-ups", sets: 3, reps: "10", rest: "60 sec" },
          { name: "Squats", sets: 3, reps: "12", rest: "60 sec" },
          { name: "Plank", sets: 3, reps: "30 sec", rest: "30 sec" }
        ]
      }
    ]
  };
};

exports.getWorkoutPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.goal) {
      return res.status(400).json({
        message: "Please complete profile first"
      });
    }

    const workout = getWorkoutPlan(user.goal);

    res.json(workout);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};