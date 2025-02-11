import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { TryCatch } from "./errorMiddleware.js"
import { cookie } from "express-validator"

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        console.error("JWT Error", error.message)
        throw new ApiError("Invalid or expired token", 401)
    }
}

const isAuthenticated = TryCatch((req, res, next) => {
    const token = req.cookies.social_token;
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

const parseCookies = (cookieString) => {
    if (!cookieString) return {};
  
    return cookieString.split(';').reduce((acc, cookie) => {
      const [key, ...valueParts] = cookie.trim().split('=');
      const value = valueParts.join('='); 
      if (key) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {});
}

const socketAuthenticator = async (socket, next) => {
    try {
        const cookies = parseCookies(socket.request.headers.cookie || "")
        const authToken = cookies["social_token"]
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