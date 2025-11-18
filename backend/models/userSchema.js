import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"],
        minlength: [3, "Name should have atleast 3 characters"],
        maxlength: [30, "Name should be less than 30 characters"],
    },
    email:{
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone:{
        type: String,
        required: [true, "Please enter your phone number"],
        unique: true,
        validate: [validator.isMobilePhone, "Please enter a valid phone number"],
    },
    address:{
        type: String,
        required: [true, "Please enter your address"]
    },
    niches:{
        firstNiche:String,
        secondNiche:String,
        thirdNiche:String,
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password should be atleast 8 characters"],
        maxlength: [32, "Password should be less than 20 characters"],
        select: false, // password will not be returned by default in any request
    },
    resume:{
        public_id: String,
        url: String, // not doing require here because user may not upload resume at the time of registration
    },
    coverLetter:{
        type: String,
    },
    role:{
        type: String,
        required: true,
        enum: ["Job Seeker", "Employer"], // enum is used to restrict the value of role to either "user" or "admin"
    },
    createdAt:{
        type: Date,
        default: Date.now,
    } // user creation date
});
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); // hashing password with bcrypt for hiding password.
});
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};  
export const User = mongoose.model("User", userSchema);