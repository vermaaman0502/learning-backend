import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response

    //get user detail from postman or frontend
    const {fullName, email, username, password} = req.body
    // console.log("email:", email)

    
    //Validation, no field is empty
    if (
        [fullName, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    //validate, '@' is included in gmail
    if (!email.includes("@")) {
        throw new ApiError(400, "@ is missing from email")
    }


    //check if user is already exist from MongoDB database
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(existedUser);

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }
    console.log(req.files);

    //check for images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }

    
    //check for avatar, avatar is required
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }


    //upload them to cloudinary(avatar)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;


    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }



    //create user object
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshTokens")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }


    //return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )



})


export {registerUser}