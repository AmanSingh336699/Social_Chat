
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || "Internal Server Error";

    if(err.code === 11000){
        const fields = Object.keys(err.keyPattern).join(", ")
        message = `Dupilicate field - ${fields}`
        statusCode = 400
    }

    if(err.name === "CastError"){
        message = `Invalide format of ${err.path}`
        statusCode = 400
    }

    if(err.name === "ValidationError"){
        message = Object.values(err.errors).map(val => val.message).join(", ")
        statusCode = 400
    }

    if(err.name === "JsonWebTokenError"){
        message = "Invalid Token PLease Login Again!"
        statusCode = 401
    }

    if(err.name === "TokenExpiredError"){
        message = "Session TokenExpiredError, Please Login Again!"
        statusCode = 401
    }

    const response = {
        success: false,
        message
    }

    res.status(statusCode).json(response)
}

export default errorMiddleware

export const TryCatch = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

