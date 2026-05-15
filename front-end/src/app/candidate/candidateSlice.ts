import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getApiErrorMessage } from "@/utils/api";
import { toast } from "sonner";
import type { RootState } from "../store";

export type CandidateProfileData = {
  id: number;
  user_id: number;
  headline?: string | null;
  phone?: string | null;
  location?: string | null;
  resume_url?: string | null;
  social_media?: string[] | null;
  created_at: string;
  updated_at: string;
};

export type UpdateCandidateProfilePayload = {
  headline?: string;
  phone?: string;
  location?: string;
  social_media?: string[];
};

type CandidateState = {
  profile: CandidateProfileData | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
};

const initialState: CandidateState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
};

export const fetchCandidateProfileThunk = createAsyncThunk<
  CandidateProfileData,
  void,
  { rejectValue: string }
>("candidate/fetchProfile", async (_, thunkApi) => {
  try {
    const res = await api.get("/candidates/me");
    return res.data?.data ?? res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    return thunkApi.rejectWithValue(message);
  }
});

export const updateCandidateProfileThunk = createAsyncThunk<
  CandidateProfileData,
  UpdateCandidateProfilePayload,
  { rejectValue: string }
>("candidate/update", async (payload, thunkApi) => {
  try {
    const res = await api.put("/candidates/", payload);
    toast.success("Profile updated successfully!");
    return res.data?.data ?? res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    toast.error(message, {
      description: "Failed to update candidate profile.",
    });
    return thunkApi.rejectWithValue(message);
  }
});

export const uploadResumeThunk = createAsyncThunk<
  CandidateProfileData,
  File,
  { rejectValue: string }
>("candidate/uploadResume", async (file, thunkApi) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.put("/candidates/upload/resumes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Resume uploaded successfully!");
    return res.data?.data ?? res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    toast.error(message, { description: "Failed to upload resume." });
    return thunkApi.rejectWithValue(message);
  }
});

export const uploadCandidateAvatarThunk = createAsyncThunk<
  string,
  File,
  { rejectValue: string }
>("candidate/uploadAvatar", async (file, thunkApi) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.put("/upload/avatars", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Avatar uploaded successfully!");
    return res.data?.data ?? res.data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    toast.error(message, { description: "Failed to upload avatar." });
    return thunkApi.rejectWithValue(message);
  }
});

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCandidateProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCandidateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch profile";
      });

    builder
      .addCase(updateCandidateProfileThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateCandidateProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isUpdating = false;
      })
      .addCase(updateCandidateProfileThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to update profile";
      });

    builder
      .addCase(uploadResumeThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(uploadResumeThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isUpdating = false;
      })
      .addCase(uploadResumeThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to upload resume";
      });

    builder
      .addCase(uploadCandidateAvatarThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(uploadCandidateAvatarThunk.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(uploadCandidateAvatarThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to upload avatar";
      });
  },
});

export const { clearError, clearUpdateError } = candidateSlice.actions;

export const selectCandidateProfile = (state: RootState) =>
  state.candidate.profile;
export const selectCandidateIsLoading = (state: RootState) =>
  state.candidate.isLoading;
export const selectCandidateError = (state: RootState) => state.candidate.error;
export const selectCandidateIsUpdating = (state: RootState) =>
  state.candidate.isUpdating;
export const selectCandidateUpdateError = (state: RootState) =>
  state.candidate.updateError;

export default candidateSlice.reducer;
