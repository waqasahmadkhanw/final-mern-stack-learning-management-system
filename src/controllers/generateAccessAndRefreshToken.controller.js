import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"

const generateAccessAndRefreshToken=async(userid)=>{
try {
    const user=await User.findById(userid)
    const refreshToken=await user.generatereRreshToken()
    const accessToken=await user.generateAccessToken()
    user.refreshToken=refreshToken
     await user.save({ validateBeforeSave: false })
     return {accessToken,refreshToken}
} catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
}
}
export default generateAccessAndRefreshToken