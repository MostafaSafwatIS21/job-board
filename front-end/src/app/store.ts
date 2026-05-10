import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import jobListReducer from "./jobListSlice";
import applicationReducer from "./application/appSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    jobList: jobListReducer,
    applications: applicationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
