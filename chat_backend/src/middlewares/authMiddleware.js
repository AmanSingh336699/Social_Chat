import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { TryCatch } from "./errorMiddleware.js"

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new ApiError("Invalid or expired token", 401)
    }
}

const isAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies.social_token;
    console.log("req cookies",req.cookies)
    console.log("token",token)
    if(!token) return next(new ApiError("Please login to access this route", 401))

    const decodedData = verifyToken(token)
    req.user = decodedData._id
    next()
})

const adminOnly = (req, res, next) => {
    const token = req.cookies["social-admin-token"];
    if(!token) throw new ApiError("Only Admin can access this route", 401)
    
    if(verifyToken(token) !== process.env.ADMIN_SECRET_KEY){
        throw new ApiError("Only Admin can access this route", 401)
    }
    next()
}

const socketAuthenticator = async (err, socket, next) => {
    try {
        if(err) return next(err)
        
        const authToken = socket.request.cookies["social-token"]
        console.log(authToken)
        if(!authToken){
            throw new ApiError("Authentication token", 401)
        }

        const decodedData = verifyToken(authToken)
        const user = await User.findById(decodedData._id)
        if(!user){
            throw new ApiError("User not found", 401)
        }
        socket.user = user
        next()
    } catch (error) {
        console.error("Socket Authentication Error", error.message)
        return next(new ApiError("Please login to access this route", 401))
    }
}

export { isAuthenticated, adminOnly, socketAuthenticator };