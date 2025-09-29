const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        minlength: [3, "Full name must be at least 3 characters"],
        maxlength: [50, "Full name cannot be more than 50 characters"],
        trim: true
    },
    role:{
        type:String,
        default:"User"
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        //match: [/^\d{10}$/, "Phone number must be 10 digits"] // basic Indian-style 10 digit
    },
    courseOfInterest:{
        type:String,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
{timestamps:true},
);

module.exports = mongoose.model("User", userSchema);
