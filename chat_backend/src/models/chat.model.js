import mongoose, { Schema, Types } from "mongoose";

const chatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    groupChat: {
        type: Boolean,
        default: false
    },
    creator: {
        type: Types.ObjectId,
        ref: "User",
        // required: true
    },
    members: [{
        type: Types.ObjectId,
        ref: "User",
    }]
}, { timeseries: true })

export const Chat = mongoose.model("Chat", chatSchema)