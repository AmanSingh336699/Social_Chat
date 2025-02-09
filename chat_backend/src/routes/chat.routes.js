import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from "../lib/validator.js";
import { addMembers, deleteChat, getChatDetails, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chat.controller.js";

const router = express.Router();

router.use(isAuthenticated)

router.post("/new", newGroupValidator(), validateHandler, newGroupChat)
router.get("/my", getMyChats)
router.get("/my/groups", getMyGroups)
router.put("/addmembers", addMemberValidator(), validateHandler, addMembers)
router.put("/removemember", removeMemberValidator(), validateHandler, removeMember)

router.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup)
router.post("/message", attachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments)
router.route("/:id").get(chatIdValidator(), validateHandler, getChatDetails)
        .put(renameValidator(), validateHandler, renameGroup)
        .delete(chatIdValidator(), validateHandler, deleteChat)

export default router;