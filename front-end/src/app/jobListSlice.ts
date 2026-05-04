import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getApiErrorMessage } from "@/utils/api";
import { toast } from "sonner";
import type { IQuery } from "@/interfaces";

type workType = "remote" | "on_site";
type experienceLevel =
  | "entry_level"
  | "mid_level"
  | "senior_level"
  | "executive_level";

interface JobList {
  id: number;
  title: string;
  description: string;
  location: string;
  work_type: workType;
  experience_level: experienceLevel;
  salary_min: number;
  salary_max: number;
  deadline: string;
  category_id: number;
  skills: string[];
  status: string;
  employer_id: number;
  created_at: string;
  updated_at: string;
}

interface JobListState {
  jobs: JobList[];
  currentJob: JobList | null;
  loading: boolean;
  error: string | null;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface JobListingsResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  data: JobList[];
}

export const getJobListings = createAsyncThunk(
  "job-listings/getJobListings",
  async (params: IQuery | undefined, thunkApi) => {
    try {
      const response = await api.get<JobListingsResponse>(`/job-listings`, {
        params,
      });
      return response.data;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);

      toast.error(errorMessage, {
        description: "Failed to load job listings.",
      });

      return thunkApi.rejectWithValue(errorMessage);
    }
  },
);

export const getJobListingById = createAsyncThunk(
  "job-listings/getJobListingById",
  async (id: number, thunkApi) => {
    try {
      const response = await api.get(`/job-listings/${id}`);
      return response.data.data as JobList;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);

      toast.error(errorMessage, {
        description: "Failed to load job details.",
      });

      return thunkApi.rejectWithValue(errorMessage);
    }
  },
);

const initialState: JobListState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 10,
};

const jobListSlice = createSlice({
  name: "joblist",
  initialState,
  reducers: {
    clearCurrentJob(state) {
      state.currentJob = null;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── getJobListings ──
    builder.addCase(getJobListings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getJobListings.fulfilled, (state, action) => {
      state.jobs = action.payload.data;
      state.currentPage = action.payload.page;
      state.limit = action.payload.limit;
      state.totalItems = action.payload.total;
      state.totalPages = action.payload.total_pages;
      state.loading = false;
    });
    builder.addCase(getJobListings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ── getJobListingById ──
    builder.addCase(getJobListingById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getJobListingById.fulfilled, (state, action) => {
      state.currentJob = action.payload;
      state.loading = false;
    });
    builder.addCase(getJobListingById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentJob, setPage } = jobListSlice.actions;
export default jobListSlice.reducer;
