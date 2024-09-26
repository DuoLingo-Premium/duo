import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducers/authReducer";
import gameReducer from "../redux/reducers/gameReducer";
import languageReducer from "../redux/reducers/languageReducer";
import userReducer from "../redux/reducers/userReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    language: languageReducer,
    game: gameReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
