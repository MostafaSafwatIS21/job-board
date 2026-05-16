import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import jobListReducer from "./jobListing/jobListSlice";
import applicationReducer from "./application/appSlice";
import adminReducer from "./admin/adminSlice";
import employerReducer from "./employer/employerSlice";
import candidateReducer from "./candidate/candidateSlice";
import notificationReducer from "./notification/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    jobList: jobListReducer,
    applications: applicationReducer,
    admin: adminReducer,
    employer: employerReducer,
    candidate: candidateReducer,
    notification: notificationReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
