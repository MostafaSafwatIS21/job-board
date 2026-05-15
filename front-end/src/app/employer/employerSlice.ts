import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getApiErrorMessage } from "@/utils/api";
import { toast } from "sonner";
import type { RootState } from "../store";
import type { JobListingData } from "../admin/adminSlice";

// ─── Types ─────────────────────────────────────────────────────────────────

export type EmployerProfileData = {
  id: number;
  user_id: number;
  company_name: string;
  company_website: string;
  company_description?: string;
  company_logo?: string;
  company_location: string;
  created_at: string;
  updated_at: string;
};

export type CreateEmployerProfilePayload = {
  company_name: string;
  company_website: string;
  company_description?: string;
  company_logo?: string;
  company_location: string;
};

export type UpdateEmployerProfilePayload =
  Partial<CreateEmployerProfilePayload>;

interface EmployerState {
  profile: EmployerProfileData | null;
  profiles: EmployerProfileData[];
  jobListings: JobListingData[];
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

const initialState: EmployerState = {
  profile: null,
  profiles: [],
  jobListings: [],
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
};

// ─── Thunks ────────────────────────────────────────────────────────────────

/**
 * Get current employer profile (own profile)
 */
export const fetchEmployerProfileThunk = createAsyncThunk<
  EmployerProfileData,
  void,
  { rejectValue: string }
>("employer/fetchProfile", async (_, thunkApi) => {
  try {
    const res = await api.get("/employers/me");
    return res.data?.data ?? res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

/**
 * Get all employer profiles (public view, paginated)
 */
export const fetchAllEmployersThunk = createAsyncThunk<
  { data: EmployerProfileData[]; total: number },
  { page?: number; limit?: number },
  { rejectValue: string }
>("employer/fetchAll", async (params, thunkApi) => {
  try {
    const res = await api.get("/employers", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    });
    return {
      data: res.data?.data ?? [],
      total: res.data?.total ?? 0,
    };
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

/**
 * Get specific employer profile by ID
 */
export const fetchEmployerByIdThunk = createAsyncThunk<
  EmployerProfileData,
  number,
  { rejectValue: string }
>("employer/fetchById", async (employerId, thunkApi) => {
  try {
    const res = await api.get(`/employers/${employerId}`);
    return res.data?.data ?? res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

/**
 * Update current employer profile
 */
export const updateEmployerProfileThunk = createAsyncThunk<
  EmployerProfileData,
  UpdateEmployerProfilePayload,
  { rejectValue: string }
>("employer/update", async (payload, thunkApi) => {
  try {
    const res = await api.put("/employers", payload);
    toast.success("Profile updated successfully!");
    return res.data?.data ?? res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    toast.error(errorMessage, {
      description: "Failed to update employer profile.",
    });
    return thunkApi.rejectWithValue(errorMessage);
  }
});

/**
 * Delete current employer profile
 */
export const deleteEmployerProfileThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("employer/delete", async (_, thunkApi) => {
  try {
    await api.delete("/employers");
    toast.success("Profile deleted successfully!");
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    toast.error(errorMessage, {
      description: "Failed to delete employer profile.",
    });
    return thunkApi.rejectWithValue(errorMessage);
  }
});

/**
 * Upload company logo
 */
export const uploadLogoThunk = createAsyncThunk<
  EmployerProfileData,
  File,
  { rejectValue: string }
>("employer/uploadLogo", async (file, thunkApi) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.put("/upload/logos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Logo uploaded successfully!");
    return res.data?.data ?? res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    toast.error(errorMessage, {
      description: "Failed to upload logo.",
    });
    return thunkApi.rejectWithValue(errorMessage);
  }
});

/**
 * Upload avatar
 */
export const uploadAvatarThunk = createAsyncThunk<
  string,
  File,
  { rejectValue: string }
>("employer/uploadAvatar", async (file, thunkApi) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.put("/upload/avatars", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Avatar uploaded successfully!");
    return res.data?.data ?? res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    toast.error(errorMessage, {
      description: "Failed to upload avatar.",
    });
    return thunkApi.rejectWithValue(errorMessage);
  }
});
/**
 * Fetch employer's own job listings
 */
export const fetchEmployerJobListingsThunk = createAsyncThunk<
  { message: string; data: JobListingData[] },
  void,
  { rejectValue: string }
>("employer/fetchJobListings", async (_, thunkApi) => {
  try {
    const res = await api.get("/employers/job-listings");
    return res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    toast.error(errorMessage, {
      description: "Failed to fetch job listings.",
    });
    return thunkApi.rejectWithValue(errorMessage);
  }
});

export const updateJobListingThunk = createAsyncThunk<
  { message: string; data: JobListingData },
  { jobId: number; data: Partial<JobListingData> },
  { rejectValue: string }
>("employer/updateJobListing", async (payload, thunkApi) => {
  try {
    const res = await api.put(`/job-listings/${payload.jobId}`, payload.data);
    toast.success("Job listing updated successfully!");
    return res.data;
  } catch (error) {
    const errorMessage = getApiErrorMessage(error);
    toast.error(errorMessage, {
      description: "Failed to update job listing.",
    });
    return thunkApi.rejectWithValue(errorMessage);
  }
});

// ─── Slice ─────────────────────────────────────────────────────────────────

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch own profile ───────────────────────────────────────────────
    builder
      .addCase(fetchEmployerProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployerProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmployerProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch profile";
      });

    // ── Fetch all employers ─────────────────────────────────────────────
    builder
      .addCase(fetchAllEmployersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployersThunk.fulfilled, (state, action) => {
        state.profiles = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchAllEmployersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch employers";
      });

    // ── Fetch employer by ID ────────────────────────────────────────────
    builder
      .addCase(fetchEmployerByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployerByIdThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmployerByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch employer";
      });

    // ── Update profile ──────────────────────────────────────────────────
    builder
      .addCase(updateEmployerProfileThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateEmployerProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isUpdating = false;
      })
      .addCase(updateEmployerProfileThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to update profile";
      });

    // ── Delete profile ──────────────────────────────────────────────────
    builder
      .addCase(deleteEmployerProfileThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(deleteEmployerProfileThunk.fulfilled, (state) => {
        state.profile = null;
        state.isUpdating = false;
      })
      .addCase(deleteEmployerProfileThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to delete profile";
      });

    // ── Upload logo ─────────────────────────────────────────────────────
    builder
      .addCase(uploadLogoThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(uploadLogoThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isUpdating = false;
      })
      .addCase(uploadLogoThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to upload logo";
      });

    // ── Upload avatar ───────────────────────────────────────────────────
    builder
      .addCase(uploadAvatarThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(uploadAvatarThunk.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(uploadAvatarThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload ?? "Failed to upload avatar";
      });

    // ── Fetch employer job listings ─────────────────────────────────────
    builder
      .addCase(fetchEmployerJobListingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployerJobListingsThunk.fulfilled, (state, action) => {
        state.jobListings = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchEmployerJobListingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch job listings";
      });
  },
});

// ─── Exports ────────────────────────────────────────────────────────────────

export const { clearError, clearUpdateError, clearProfile } =
  employerSlice.actions;

// Selectors
export const selectEmployerProfile = (state: RootState) =>
  state.employer.profile;
export const selectAllEmployers = (state: RootState) => state.employer.profiles;
export const selectEmployerIsLoading = (state: RootState) =>
  state.employer.isLoading;
export const selectEmployerError = (state: RootState) => state.employer.error;
export const selectEmployerIsUpdating = (state: RootState) =>
  state.employer.isUpdating;
export const selectEmployerUpdateError = (state: RootState) =>
  state.employer.updateError;
export const selectEmployerJobListings = (state: RootState) =>
  state.employer.jobListings;

export default employerSlice.reducer;
