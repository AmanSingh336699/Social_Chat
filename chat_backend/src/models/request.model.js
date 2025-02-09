import mongoose, { Schema, Types } from "mongoose";

const requestSchema = new Schema({
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"]
    },
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timeseries: true })

export const Request = mongoose.model("Request", requestSchema)