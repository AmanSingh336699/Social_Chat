import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";

const initialState = {
    notificationCount: 0,
    newMessageAlert: getOrSaveFromStorage({
        key: "NEW_MESSAGE_ALERT",
        get: true
    }) || []
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        incrementNotification: (state) => {
            state.notificationCount += 1;
        },
        resetNotificationCount: (state) => {
            state.notificationCount = 0;
        },
        setNewMessagesAlert: (state, action) => {
            const chatId = action.payload.chatId
            const index = state.newMessageAlert.findIndex(item => item.chatId === chatId)

            if(index !== -1) {
                state.newMessageAlert[index].count += 1;
            } else {
                state.newMessageAlert.push({
                    chatId,
                    count: 1
                })
            }
        },
        removeNewMessagesAlert: (state, action) => {
            state.newMessageAlert = state.newMessageAlert.filter(
                (item) => item.chatId !== action.payload
            )
        }
    }
})

export default chatSlice;
export const {
  incrementNotification,
  resetNotificationCount,
  setNewMessagesAlert,
  removeNewMessagesAlert,
} = chatSlice.actions;