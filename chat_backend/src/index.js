import express from "express"
import dotenv from "dotenv"
dotenv.config({
    path: "../.env",
})

import cors from "cors"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import {createServer} from "http"
import dbConnect from "./lib/dbConnect.js"
import corsOption from "./constants/config.js"
import { socketAuthenticator } from "./middlewares/authMiddleware.js"
import { Message } from "./models/message.model.js"
import { getSockets } from "./lib/socketHelper.js"
import { v4 as uuidv4 } from "uuid"
import errorMiddleware from "./middlewares/errorMiddleware.js"
import { v2 as cloudinary }  from "cloudinary"


const adminSecretKey = process.env.ADMIN_SECRET_KEY
const userSocketIDs = new Map()
const onlineUsers = new Set()

dbConnect()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express()
const server = createServer(app)
app.use(cookieParser())

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }
})

app.set("io", io)
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))


io.use(async (socket, next) => {
    await socketAuthenticator(socket, next)
})

io.on("connection", (socket) => {
    const user = socket.user
    userSocketIDs.set(user._id.toString(), socket.id)

    socket.on("NEW_MESSAGE", async ({ chatId, members, message }) => {
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };
        
        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        }
        
        const membersSocket = getSockets(members)
        io.to(membersSocket).emit("NEW_MESSAGE", {
            chatId, message: messageForRealTime
        })
        io.to(membersSocket).emit("NEW_MESSAGE_ALERT", { chatId })
        
        try {
            await Message.create(messageForDB)
        } catch (error) {
            throw new Error(error)
        }
    })
    
    socket.on("START_TYPING", ({ members, chatId }) => {
        const membersSockets = getSockets(members)
        socket.to(membersSockets).emit("START_TYPING", { chatId })
    })
    
    socket.on("STOP_TYPING", ({ members, chatId }) => {
        const membersSockets = getSockets(members)
        socket.to(membersSockets).emit("STOP_TYPING", { chatId })
    })
    
    socket.on("CHAT_JOINED", ({ userId, members }) => {
        onlineUsers.add(userId.toString())
        
        const membersSocket = getSockets(members)
        io.to(membersSocket).emit("ONLINE_USERS", Array.from(onlineUsers))
    })
    
    socket.on("CHAT_LEAVED", ({ userId, members }) => {
        onlineUsers.delete(userId.toString())
        
        const membersSocket = getSockets(members)
        io.to(membersSocket).emit("ONLINE_USERS", Array.from(onlineUsers))
    })
    
    socket.on("disconnect", () => {
        userSocketIDs.delete(user._id.toString())
        onlineUsers.delete(user._id.toString())
        socket.broadcast.emit("ONLINE_USERS", Array.from(onlineUsers))
    })
})

//routes
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.routes.js";
import adminRoute from "./routes/admin.routes.js";


app.use("/api/v1/user", userRoute)
app.use("/api/v1/chat", chatRoute)
app.use("/api/v1/admin", adminRoute)

app.use(errorMiddleware)

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

export { userSocketIDs, adminSecretKey}