import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getApiErrorMessage } from "@/utils/api";
import type { RootState } from "../store";

export type JobListingData = {
  id: number;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  work_type: string;
  experience_level: string;
  deadline: string;
  status: "pending" | "approved" | "rejected";
  category_id: number;
  employer_id: number;
  created_at: string;
  skills?: string[];
  employer?: {
    id: number;
    name: string;
    user_id: number;
  };
};

export type EmployerProfileData = {
  id: number;
  user_id: number;
  company_name: string;
  company_website: string;
  company_description?: string;
  company_logo?: string;
  company_location: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

interface AdminState {
  jobListings: JobListingData[];
  employers: EmployerProfileData[];
  selectedJobListing: JobListingData | null;
  selectedEmployer: EmployerProfileData | null;
  selectedEmployerJobListings: JobListingData[]; // Detailed job listings for selected employer
  isLoading: boolean;
  error: string | null;
  totalJobListings: number;
  totalEmployers: number;
}

const initialState: AdminState = {
  jobListings: [],
  employers: [],
  selectedJobListing: null,
  selectedEmployer: null,
  selectedEmployerJobListings: [],
  isLoading: false,
  error: null,
  totalJobListings: 0,
  totalEmployers: 0,
};

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const fetchJobListingsThunk = createAsyncThunk<
  { data: JobListingData[]; total: number },
  { page?: number; limit?: number },
  { rejectValue: string }
>("admin/fetchJobListings", async (params, thunkApi) => {
  try {
    // Use admin endpoint to get ALL job listings (not just approved)
    const res = await api.get("/admin/job-listings", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    });
    return {
      data: res.data?.data ?? [],
      total: res.data?.total ?? 0,
    };
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const fetchEmployersThunk = createAsyncThunk<
  { data: EmployerProfileData[]; total: number },
  { page?: number; limit?: number },
  { rejectValue: string }
>("admin/fetchEmployers", async (params, thunkApi) => {
  try {
    const res = await api.get("/admin/employers", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    });
    return {
      data: res.data?.data ?? [],
      total: res.data?.total ?? 0,
    };
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const fetchJobListingDetailThunk = createAsyncThunk<
  JobListingData,
  number,
  { rejectValue: string }
>("admin/fetchJobListingDetail", async (jobId, thunkApi) => {
  try {
    const res = await api.get(`/admin/job-listings/${jobId}`);
    return res.data?.data ?? res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const fetchEmployerDetailThunk = createAsyncThunk<
  EmployerProfileData,
  number,
  { rejectValue: string }
>("admin/fetchEmployerDetail", async (employerId, thunkApi) => {
  try {
    const res = await api.get(`/admin/employers/${employerId}`);
    return res.data?.data ?? res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const updateJobListingStatusThunk = createAsyncThunk<
  JobListingData,
  { jobId: number; status: "approved" | "rejected" | "pending" },
  { rejectValue: string }
>("admin/updateJobListingStatus", async (params, thunkApi) => {
  try {
    const res = await api.put(`/admin/job-listings/${params.jobId}/status`, {
      status: params.status,
    });
    return res.data?.data ?? res.data;
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

/**
 * Fetch detailed job listings for a specific employer
 * Uses the admin endpoint that returns employer-specific job listings with full details
 */
export const fetchEmployerJobListingsDetailThunk = createAsyncThunk<
  JobListingData[],
  number, // employerId
  { rejectValue: string }
>("admin/fetchEmployerJobListingsDetail", async (employerId, thunkApi) => {
  try {
    const res = await api.get(`/admin/employers/${employerId}/job-listings`);
    return res.data?.data ?? [];
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

// ─── Slice ─────────────────────────────────────────────────────────────────────

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch job listings ──────────────────────────────────────────────
    builder
      .addCase(fetchJobListingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobListingsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobListings = action.payload.data;
        state.totalJobListings = action.payload.total;
      })
      .addCase(fetchJobListingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch job listings";
      });

    // ── Fetch employers ─────────────────────────────────────────────────
    builder
      .addCase(fetchEmployersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employers = action.payload.data;
        state.totalEmployers = action.payload.total;
      })
      .addCase(fetchEmployersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch employers";
      });

    // ── Fetch job listing detail ────────────────────────────────────────
    builder
      .addCase(fetchJobListingDetailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobListingDetailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedJobListing = action.payload;
      })
      .addCase(fetchJobListingDetailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch job listing";
      });

    // ── Fetch employer detail ───────────────────────────────────────────
    builder
      .addCase(fetchEmployerDetailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployerDetailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEmployer = action.payload;
      })
      .addCase(fetchEmployerDetailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch employer";
      });

    // ── Update job listing status ───────────────────────────────────────
    builder
      .addCase(updateJobListingStatusThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJobListingStatusThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the listing in the array
        const index = state.jobListings.findIndex(
          (j) => j.id === action.payload.id,
        );
        if (index !== -1) {
          state.jobListings[index] = action.payload;
        }
        // Also update the selected listing if it's the same one
        if (state.selectedJobListing?.id === action.payload.id) {
          state.selectedJobListing = action.payload;
        }
      })
      .addCase(updateJobListingStatusThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to update job listing";
      });

    // ── Fetch employer job listings detail ─────────────────────────────
    builder
      .addCase(fetchEmployerJobListingsDetailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchEmployerJobListingsDetailThunk.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.selectedEmployerJobListings = action.payload;
        },
      )
      .addCase(
        fetchEmployerJobListingsDetailThunk.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.payload ?? "Failed to fetch employer job listings";
        },
      );
  },
});

export const { clearError } = adminSlice.actions;

export const selectAdmin = (state: RootState) => state.admin;
export const selectJobListings = (state: RootState) => state.admin.jobListings;
export const selectEmployers = (state: RootState) => state.admin.employers;
export const selectSelectedJobListing = (state: RootState) =>
  state.admin.selectedJobListing;
export const selectSelectedEmployer = (state: RootState) =>
  state.admin.selectedEmployer;
export const selectSelectedEmployerJobListings = (state: RootState) =>
  state.admin.selectedEmployerJobListings;

export default adminSlice.reducer;
