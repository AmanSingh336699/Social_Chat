import { ApiError } from "../utils/ApiError.js";
import { body, param, validationResult } from "express-validator"

const validateHandler = (req, res, next) => {
    const errors = validationResult(req)

    const errorMessages = errors.array().map(error => error.msg).join(", ")
    if(errors.isEmpty()) return next()
    else next(new ApiError(errorMessages, 400))
}

const registerValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("username", "Please Enter Username").notEmpty(),
    body("bio", "Please Enter bio").notEmpty(),
    body("password", "Please Enter Password with at least 8 characters and 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/),
]

const loginValidator = () => [
    body("username", "Please Enter Username").notEmpty(),
    body("password", "Please Enter Password").notEmpty(),
]

const newGroupValidator = () => [
    body("name", "Please Enter Name").notEmpty(),
    body("members").notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 2, max: 100 })
        .withMessage("Members must be 2-100")
]

const addMemberValidator = () => [
    body("chatId", "Please Enter chat ID").notEmpty(),
    body("members").notEmpty()
        .withMessage("Please Enter Members")
        .isArray({ min: 1, max: 97 })
        .withMessage("Members must be 1-97")
]

const removeMemberValidator = () => [
    body("chatId", "Please Enter chat ID").notEmpty(),
    body("userId", "Please Enter user ID").notEmpty(),
]

const sendAttachmentsValidator = () => [
    body("chatId", "Please Enter chat ID").notEmpty(),
]

const chatIdValidator = () => [
    param("id", "please enter chat ID").notEmpty(),
]

const renameValidator = () => [
    param("id", "Please Enter chat ID").notEmpty(),
    body("name", "Please Enter New Name").notEmpty(),
]

const sendRequestValidator = () => [
    body("userId", "Please Enter user ID").notEmpty(),
]

const acceptRequestValidator = () => [
    body("requestId", "Please Enter request ID").notEmpty().
        withMessage("Please add accept")
        .isBoolean()
        .withMessage("Accept must be a boolean")
]

const adminLoginValidator = () => [
    body("secretKey", "Please Enter your secret key").notEmpty()
]

export {
    acceptRequestValidator,
    addMemberValidator,
    adminLoginValidator,
    chatIdValidator,
    loginValidator,
    newGroupValidator,
    registerValidator,
    removeMemberValidator,
    renameValidator,
    sendAttachmentsValidator,
    sendRequestValidator,
    validateHandler,
  }