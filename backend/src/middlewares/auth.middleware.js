const jwt = require("jsonwebtoken")

exports.authUser = (req, res, next) => {
 
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      })
    }

      const token = authHeader.split(" ")[1]
         console.log("TOKEN:", token)
console.log("SECRET:", process.env.JWT_SECRET)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()

  } catch (err) {
  console.log("JWT ERROR:", err.message)   
  return res.status(401).json({
    message: err.message
  })
}
}