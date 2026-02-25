import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt  from "bcrypt"
const userSchema=new Schema({
name:{
type:String,
required:true,
trim:true
},
email:{
 type: String,                 // WHAT: User email address
      required:[true,"Please enter email"], // WHY: Required for login
      unique: true,                 // WHY: No duplicate accounts
      lowercase: true,              // WHY: Avoid case-sensitive duplicates
      trim: true
},
password:{
required:true,
//why string//Because we store hashed password
 type: String,
  required: [true, "Password is required"],
  minlength: 6,
},
role: {
      type: String,                 // WHAT: User role
      enum: ["admin", "instructor", "student"], // WHY: Restrict to valid roles
      default: "student"            // WHY: Default role for new users
    },
refreshToken:{
    type:String,
}

},
//for createdAt and updatedAt
{timestamps:true})


// WHAT: Hash password before saving
// WHY: Never store plain text passwords (security best practice)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//Compare password
userSchema.methods.isPasswordCorrect=async function(password){
return await bcrypt.compare(password,this.password)
};
//generate refresh Token
userSchema.methods.generatereRreshToken=function(){
    return jwt.sign({
  _id:this._id
}, process.env.REFRESH_TOKEN_SECRET, { expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
},
//generate access Token
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
  _id:this._id,
  email:this.email,
  role: this.role
}, process.env.ACCESS_TOKEN_SECRET, { expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
}
export const User=mongoose.model("User",userSchema)