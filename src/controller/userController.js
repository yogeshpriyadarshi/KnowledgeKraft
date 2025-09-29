const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const userSignup = async (req, res) => {
  try {
    const { fullName, email, phone, courseOfInterest } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    const user = new User({
      fullName,
      email,
      phone,
      courseOfInterest,
    });

    const savedUser = await user.save();

    return res.status(201).json({
      success: true,
      message: "user is creaded",
      user: savedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "fail to add user",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { phone, role, platform } = req.body;

    if (!phone || !role) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user is not available in database ",
      });
    }
    if (user.role != role) {
      return res.status(400).json({
        success: false,
        message: "This user has not authority",
      });
    }

    // 🎫  Generate your own JWT
    const JWTkraftToken = jwt.sign(
      { _id: user?._id },
      process.env.JWT_SECURITY,
      {
        expiresIn: "1d",
      }
    );

    // 5. Send differently based on platform
    if (platform === "Web") {
      res.cookie("JWTkraftToken", JWTkraftToken, {
        httpOnly: true, // Prevent JS access
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "None", // Allow cross-site requests
        path: "/", // Available site-wide
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7-day expiry
      });
      return res.json({
        success: true,
        message: "Login successful (web)",
        user,
      });
    } else {
      // ✅ For Android/iOS app → JSON response
      return res.json({
        success: true,
        JWTkraftToken,
        message: "Login successful (mobile)",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};


const userProfile = async (req, res) => {
  try {

    return res.status(200).json({
      success: true,
      message: "profile detail",
      user:req.user
    });

  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "fail to get user",
    });
  }
};

module.exports = { userSignup, userProfile, userLogin };
