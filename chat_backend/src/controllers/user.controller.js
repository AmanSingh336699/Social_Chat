import { compare } from "bcrypt";
import { TryCatch } from "../middlewares/errorMiddleware.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { Request } from "../models/request.model.js"
import { getOtherMember } from "../lib/socketHelper.js";
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = TryCatch(async (req, res, next) => {
    const { name, username, password, bio } = req.body
    const file = req.file
    if(!file) return next(new ApiError("please Upload Avatar", 400))
    
    const existedUser = await User.findOne({username})
    if(existedUser){
        throw new ApiError("User already exists", 400)
    }
    const result = await uploadFilesToCloudinary([file])
    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    }

    const user = await User.create({ name, bio, username, password, avatar })

    sendToken(res, user, 201, "User created successfully")
})

const loginUser = TryCatch(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select("+password")
    if(!user){
        throw new ApiError("User not found", 404)
    }
    const isPasswordMatch = await compare(password, user.password)
    if(!isPasswordMatch){
        throw new ApiError("Invalid user or password", 404)
    }
    sendToken(res, user, 200, `Welcome Back ${user.name}`)
})

const getMyProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.user)

    if(!user){
        throw new ApiError("User not found", 404)
    }

    res.status(200).json({ success: true, user })
})

const logoutUser = TryCatch(async (req, res) => {
    return res.status(200).cookie("social-token", "", { ...cookieOptions }).json({
        success: true,
        message: "Logged out successfully"
    })
})


const searchUser = TryCatch(async (req, res) => {
    const { name = "" } = req.query;
    const myChats = await Chat.find({ groupChat: false, members: req.user })

    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members)
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $in: allUsersFromMyChats },
        name: { $regex: name, $options: "i" }
    })

    const users = allUsersExceptMeAndFriends.map(({_id, name, avatar}) => ({
        _id, name, avatar: avatar.url
    }))

    return res.status(200).json({ success: true, users })
})

const sendFriendRequest = TryCatch(async (req, res) => {
    const { userId } = req.body

    const existingRequest = await Request.findOne({
        $or: [{ sender: req.user, receiver: userId }, { sender: userId, receiver: req.user }]
    })

    if(existingRequest){
        throw new ApiError("Friend request already sent", 400)
    }

    await Request.create({ sender: req.user, receiver: userId })

    emitEvent(req, "NEW_REQUEST", [userId])

    return res.status(200).json({ success: true, message: "Friend Reques Sent" })
})

const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const {requestId, accept} = req.body

    const request = await Request.findById(requestId)
    if(!request) return next(new ApiError("Request not found", 404))
    
    if(request.receiver._id.toString() !== req.user.toString())
        return next( new ApiError("You are not authorized to accept this request", 401))

    if(!accept){
        await request.deleteOne()
        return res.status(200).json({ success: true, message: "Friend Request Rejected"})
    }

    const members = [request.sender._id, request.receiver._id]

    await Promise.all([
        Chat.create({members, name: `${request.sender.name}-${request.receiver.name}`}),
        request.deleteOne(),
    ]);
    emitEvent(request, "REFETCH_CHATS", members)

    return res.status(200).json({success: true, message: "Friend Request Accepted", senderId: request.sender._id})
})

const getMyNotifications = TryCatch(async (req, res) => {
    const requests = await Request.find({ receiver: req.user }).populate("sender", "name avatar")

    const allRequests = requests.map(({_id, sender}) => ({
        _id, sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url
        }
    }))
    return res.status(200).json({success: true, allRequests})
})

const getMyFriends = TryCatch(async (req, res) => {
    const {chatId} = req.query

    const chats = await Chat.find({ members: req.user, groupChat: false }).populate("members", "name avatar")
    const friends = chats.map(({members}) => {
        const otherUser = getOtherMember(members, req.user)
        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url
        }
    })

    if(chatId){
        const chat = await Chat.findById(chatId)
        const availableFriends = friends.filter((friend) => !chat.members.includes(friend._id))

        return res.status(200).json({
            success: true,
            friends: availableFriends
        })
    } else {
        return res.status(200).json({ success: true, friends })
    }
})

export {
    acceptFriendRequest,
    getMyFriends,
    getMyNotifications,
    getMyProfile,
    loginUser,
    logoutUser,
    registerUser,
    searchUser,
    sendFriendRequest,
  };