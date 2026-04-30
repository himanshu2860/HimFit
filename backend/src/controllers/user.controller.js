const User = require("../models/user");
const { calculateHealth } = require("../services/health.service");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      heightInput,
      heightUnit,
      weightInput,
      weightUnit,
      age,
      gender,
      activityLevel,
      goal,
      dietType
    } = req.body;

  
    const healthData = calculateHealth({
      heightInput,
      heightUnit,
      weightInput,
      weightUnit,
      age,
      gender,
      activityLevel,
      goal
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        heightInput,
        heightUnit,
        weightInput,
        weightUnit,
        age,
        gender,
        activityLevel,
        goal,
        dietType,

        ...healthData 
      },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateProfile, getProfile

};