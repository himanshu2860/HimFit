const express = require("express");
const router = express.Router();

const { updateProfile,getProfile } = require("../controllers/user.controller");
const { authUser } = require("../middlewares/auth.middleware");

router.put("/profile", authUser, updateProfile);
router.get("/profile", authUser, getProfile); 

module.exports = router;