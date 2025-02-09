import express from "express";
import {
    acceptRequestValidator,
    loginValidator,
    registerValidator,
    sendRequestValidator,
    validateHandler,
  } from "../lib/validator.js";

import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { singleAvatar } from "../middlewares/multer.js"
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, loginUser, logoutUser, registerUser, searchUser, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/new", singleAvatar, registerValidator(), validateHandler, registerUser)

router.post("/login", loginValidator(), validateHandler, loginUser)

router.use(isAuthenticated)

router.get("/me", getMyProfile)
router.get("/logout", logoutUser)
router.get("/search", searchUser)

router.put("/sendRequest", sendRequestValidator(), validateHandler, sendFriendRequest)

router.put("/acceptrequest", acceptRequestValidator(), validateHandler, acceptFriendRequest)

router.get("/notifications", getMyNotifications)
router.get("/friends", getMyFriends)

export default router;