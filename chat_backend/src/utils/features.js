import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import { v2 as cloudinary } from "cloudinary"
import { getBase64, getSockets } from "../lib/socketHelper.js"

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: true,
    sameSite: 'none',
}

const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io")
    const usersSocket = getSockets(users)
    io.to(usersSocket).emit(event, data)
}
const sendToken = (res, user, code, message) => {
    const token = jwt.sign({
        _id: user._id,
    }, process.env.JWT_SECRET, { expiresIn: "15d" })

    return res.status(code).cookie("social_token", token, cookieOptions).json({
        success: true,
        user,
        message,
    })
}

const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromise = files.map(file => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file),
                {
                    resource_type: "auto",
                    public_id: uuid()
                },
                (error, result) => {
                    if(error) return reject(error);
                    resolve(result);
                }
            )
        })
    })

    try {
        const results = await Promise.all(uploadPromise)

        const formattedResults = results.map(result =>{
            return {
                public_id: result.public_id,
                url: result.secure_url
            }
        })
        return formattedResults;
    } catch (error) {
        throw new Error("Error uploading file on cloudinary" + error.message)
    }
}

const deleteFilesFromCloudinary = async (public_ids = []) => {
    try {
        const deletePromise = public_ids.map(public_id => cloudinary.uploader.destroy(public_id))

        const results = await Promise.all(deletePromise)
        return results;
    } catch (error) {
        console.error("Error deleting files from cloudinary" + error.message)
        throw new Error("Error deleting file on cloudinary")
    }
}

export {
    sendToken,
    emitEvent,
    cookieOptions,
    deleteFilesFromCloudinary,
    uploadFilesToCloudinary
}