import mongoose, { Schema, Types } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        attachement: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    chat: {
        type: Types.ObjectId,
        ref: "Chat",
        required: true
    }
}, { timestamps: true })

export const Message = mongoose.model('Message', messageSchema)