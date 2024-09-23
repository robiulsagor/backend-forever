import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"
import validator from "validator";

const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET)
}

const registerUser = async(req, res)=> {
    try {
        const {name, email, password} = req.body

        // check if user already exists
        const userExists = await userModel.findOne({email})
        if(userExists){
            return res.json({success: false, message: "User already exists!"})
        }

        // validate email and password
        if(!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter a valid email!"})
        }

        if(password.length < 8){
            return res.json({success: false, message: "Password must be at least 8 characters!"})
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name, email, password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({success: true, token, user, message: "User created successfully!"})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const loginUser =async (req, res)=> {
    try {
        const {email, password} = req.body
        
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found!"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return  res.json({success: false, message: "Invalid credentials!"})

        }

        const token = createToken(user._id)

        res.json({success: true, token, message: "User logged in successfully!"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

export { registerUser, loginUser };