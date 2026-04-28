import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import {
  api,
  getApiErrorMessage,
  getAuthToken,
  setAuthToken,
} from "@/utils/api";

type AuthUser = {
  name: string;
  email: string;
  completed_profile: boolean;
  role?: string;
};

type CompleteProfileResponse = {
  message: string;
  user: AuthUser;
  profile: Record<string, unknown> | null;
};

type CompleteEmployerProfilePayload = {
  company_name: string;
  company_website?: string;
  company_description?: string;
  company_logo?: string;
  company_location?: string;
};

type CompleteCandidateProfilePayload = {
  headline?: string;
  phone?: string;
  location?: string;
  resume_url?: string;
  social_media?: string[];
};

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isHydrating: boolean;
  error: string | null;
  isAuthenticated: boolean;
  completed_profile: boolean;
}

const persistedToken = getAuthToken();

const initialState: AuthState = {
  user: null,
  token: persistedToken,
  isLoading: false,
  isHydrating: Boolean(persistedToken),
  error: null,
  isAuthenticated: Boolean(persistedToken),
  completed_profile: false,
};

export const fetchCurrentUserThunk = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, thunkApi) => {
  try {
    const res = await api.get("/user");
    const user = res.data?.user as AuthUser | undefined;
    if (!user) throw new Error("Invalid user response");
    return user;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      setAuthToken(null);
    }
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const loginThunk = createAsyncThunk<
  { user: AuthUser; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, thunkApi) => {
  try {
    const res = await api.post("/auth/login", payload);
    const token = res.data?.token as string | undefined;
    const user = res.data?.user as AuthUser | undefined;
    if (!token || !user) throw new Error("Invalid login response");
    setAuthToken(token);

    return { user, token };
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const registerThunk = createAsyncThunk<
  { user: AuthUser; token: string },
  {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  },
  { rejectValue: string }
>("auth/register", async (payload, thunkApi) => {
  try {
    const res = await api.post("/auth/register", payload);
    const token = res.data?.token as string | undefined;
    const user = res.data?.user as AuthUser | undefined;

    if (!token || !user) throw new Error("Invalid register response");
    setAuthToken(token);
    return { user, token };
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, thunkApi) => {
  try {
    await api.post("/auth/logout");
    setAuthToken(null);
  } catch (err) {
    setAuthToken(null);
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const completeCandidateProfile = createAsyncThunk<
  CompleteProfileResponse,
  CompleteCandidateProfilePayload,
  { rejectValue: string }
>("auth/completeCandidateProfile", async (payload, thunkApi) => {
  try {
    const res = await api.post("/complete-profile", {
      role: "candidate",
      ...payload,
    });
    return res.data as CompleteProfileResponse;
  } catch (error) {
    return thunkApi.rejectWithValue(getApiErrorMessage(error));
  }
});

export const completeEmployerProfile = createAsyncThunk<
  CompleteProfileResponse,
  CompleteEmployerProfilePayload,
  { rejectValue: string }
>("auth/completeEmployerProfile", async (payload, thunkApi) => {
  try {
    const res = await api.post("/complete-profile", {
      role: "employer",
      ...payload,
    });
    return res.data as CompleteProfileResponse;
  } catch (error) {
    return thunkApi.rejectWithValue(getApiErrorMessage(error));
  }
});

// Backward-compat aliases for existing imports in UI.
export const candidateProfile = completeCandidateProfile;
export const employerProfile = completeEmployerProfile;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.isHydrating = false;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.completed_profile = action.payload.user.completed_profile;
        state.isHydrating = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isHydrating = false;
        state.error = action.payload ?? "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.isHydrating = false;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isHydrating = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isHydrating = false;
        state.error = action.payload ?? "Register failed";
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isHydrating = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload ?? null;
        state.isAuthenticated = false;
        state.isHydrating = false;
      })
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.isHydrating = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.isHydrating = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.completed_profile = action.payload.completed_profile;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.isHydrating = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Failed to restore user session";
      })
      .addCase(completeCandidateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeCandidateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.completed_profile = action.payload.user.completed_profile;
      })
      .addCase(completeCandidateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Complete profile failed";
      })
      .addCase(completeEmployerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeEmployerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.completed_profile = action.payload.user.completed_profile;
      })
      .addCase(completeEmployerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Complete profile failed";
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
