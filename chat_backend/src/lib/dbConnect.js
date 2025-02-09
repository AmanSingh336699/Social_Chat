import mongoose from "mongoose";
import { dbName } from "../constants/config.js";

const dbConnect = async () => {
    try {
        const data = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        console.log(`Connected to db ${data.connection.name}`)
    } catch (error) {
        console.log(`Error connecting to the database ${dbName}`)
        process.exit(1)
    }
}

export default dbConnect