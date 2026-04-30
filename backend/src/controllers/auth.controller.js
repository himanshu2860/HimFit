const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



// REGISTER
exports.register = async (req, res) => {
    try {
  console.log("PATH:", require.resolve("../models/user"))
      console.log("USER MODEL:", User)
      
       console.log("BODY:", req.body);
      const { username, email, password,  goalCalories, goalProtein, goalFat } = req.body
      
      const allowedDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com"
];

const parts = email.split("@");

if (parts.length !== 2) {
  return res.status(400).json({ message: "Invalid email format ❌" });
}

const domain = parts[1].toLowerCase();

if (!allowedDomains.includes(domain) || email.length < 10) {
  return res.status(400).json({
    message: "Please use a valid email (gmail, outlook, etc.)"
  });
      }
      


    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hash = await bcrypt.hash(password, 10)

   const user = await User.create({
  username,
  email,
  password: hash,
  goalCalories: goalCalories || 2500,
  goalProtein: goalProtein || 100,
  goalFat: goalFat || 70
})
      

const otp = Math.floor(100000 + Math.random() * 900000).toString();


user.otp = otp;
user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

await user.save();


const isDev = process.env.DEV_MODE === "true";

if (isDev) {
  console.log("🔥 DEV OTP:", otp);   // 👈 THIS IS KEY
} else {
  try {
    await sendOTP(user.email, otp);
  } catch (emailError) {
    console.log("EMAIL ERROR:", emailError);
  }
}
      

 
return res.status(201).json({
  message: "OTP sent to your email. Please verify."
});



  } catch (err) {
   console.log("REGISTER ERROR:", err)  
    res.status(500).json({ message: "Server error" })
  }
}



exports.login = async (req, res) => {
    try {
      console.log("LOGIN HIT")
    const { email, password } = req.body

    const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: "Invalid email" })
      
      if (!user.isVerified) {
  return res.status(400).json({
    message: "Please verify your email first ❌"
  });
}

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
