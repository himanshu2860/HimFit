const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



exports.register = async (req, res) => {
  try {
    const { username, email, password, goalCalories, goalProtein, goalFat } = req.body;

   const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email: normalizedEmail,
      password: hash,
      goalCalories: goalCalories || 2500,
      goalProtein: goalProtein || 100,
      goalFat: goalFat || 70
    });

    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
    try {
      console.log("LOGIN HIT")
    const { email, password } = req.body

    const normalizedEmail = email.trim().toLowerCase();
const user = await User.findOne({ email: normalizedEmail });
      if (!user) return res.status(400).json({ message: "Invalid email" })
      

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: "Invalid password" })

      
      console.log("LOGIN SECRET:", process.env.JWT_SECRET)


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

 const userData = {
  _id: user._id,
  username: user.username,
  email: user.email,
  goalCalories: user.goalCalories,
  goalProtein: user.goalProtein,
  goalFat: user.goalFat
};
    
console.log("SENDING RESPONSE");


res.json({ token, user: userData });

  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}


exports.logout = (req, res) => {
  try {
    res.status(200).json({
      message: "User logged out successfully"
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}




exports.updateGoals = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { goalCalories, goalProtein, goalFat } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        goalCalories,
        goalProtein,
        goalFat
      },
      { new: true } 
    );

    res.json({
      message: "Goals updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        goalCalories: user.goalCalories,
        goalProtein: user.goalProtein,
        goalFat: user.goalFat
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
