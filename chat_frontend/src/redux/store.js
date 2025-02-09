import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        misc: miscSlice.reducer,
        chat: chatSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (mid) => [...mid(), api.middleware]
})

export default store;