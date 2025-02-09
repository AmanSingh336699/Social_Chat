const dbName = "SOCIAL_CHAT"

const corsOption = {
    origin: [
        "http://localhost:5173",
        // process.env.CLIENT_URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}

export default corsOption;
export { dbName }
