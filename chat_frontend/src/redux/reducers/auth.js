import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, getAdmin } from "../thunks/admin";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  isAdmin: false,
  loader: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userExists: (state, action) => {
            state.user = action.payload;
            state.loader = false
        },
        userNotExists: (state) => {
            state.user = null;
            state.loader = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loader = false;
                state.isAdmin = true;
                toast.success(action.payload || "Login Successful")
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loader = false;
                state.isAdmin = false;
                toast.error(action.error.message || "Login Failed");
            })
            .addCase(getAdmin.fulfilled, (state, action) => {
                if(action.payload){
                    state.isAdmin = true
                } else {
                    state.isAdmin = false
                }
            })
            .addCase(getAdmin.rejected, (state) => {
                state.isAdmin = false
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.isAdmin = false;
                toast.success("Logout Successful")
            })
            .addCase(adminLogout.rejected, (state, action) => {
                state.isAdmin = true;
                toast.error(action.error.message || "Logout Failed");
            })
    }
})

export default authSlice;
export const { userExists, userNotExists } = authSlice.actions;