import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import themeReducer from "./themeSlice.js";

const appStore = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer
    },
});

export default appStore;