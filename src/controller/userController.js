const User = require("../model/userModel");
const jwt = require("jsonwebtoken");  // npm install jsonwebtoken.
const userSignup = async (req, res) => {
  try {
    const { fullName, email, phone, courseOfInterest } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
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
      message: "User is created",
      user: savedUser,
    });
  } catch (err) {
    console.log(err);

    // Check for duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; // which field caused duplicate
      return res.status(409).json({
        success: false,
        message: `Duplicate data: ${field} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add user",
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
        httpOnly: true,
        secure: true,     //   process.env.NODE_ENV === "Production", // allow non-HTTPS in dev
        sameSite: "None", // less strict but works in dev
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

const userLogout = async(req, res)=>{
    // Clear cookie by setting empty value and expiring it
   res.clearCookie("JWTkraftToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
  return res.status(200).json({ 
    success:true,
    message: "Logged out successfully" });

}

const userProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "profile detail",
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "fail to get user",
    });
  }
};

const viewAllUser = async(req, res)=>{
   try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 }) // recent first
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { userSignup, userLogout, userLogin, userProfile,viewAllUser };
