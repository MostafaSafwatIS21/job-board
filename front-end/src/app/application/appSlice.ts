import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getApiErrorMessage } from "@/utils/api";
import { toast } from "sonner";

type ApplicationCandidate = {
  id: number;
  name: string;
  resume_url?: string | null;
};

type ApplicationJob = {
  id: number;
  title: string;
  description: string;
  work_type: string;
  experience_level: string;
  salary_min: number;
  salary_max: number;
  status: string;
  location: string;
  deadline: string;
  created_at: string;
  skills: string[];
};

interface links {
  url: string;
  label?: string;
}

export type Application = {
  id: number;
  job_id: number;
  candidate_id: number;
  cover_letter: string;
  links: links[];
  status: string;
  created_at: string;
  updated_at: string;
  candidate?: ApplicationCandidate;
  job?: ApplicationJob;
};

type ApplicationListResponse = {
  data: Application[];
};

type ApplicationResponse = {
  message?: string;
  data: Application;
};

type CreateApplicationPayload = {
  jobId: number;
  cover_letter: string;
  links?: string[];
};

type UpdateApplicationPayload = {
  applicationId: number;
  cover_letter?: string;
  links?: string[];
};

type ApplicationState = {
  items: Application[];
  current: Application | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
};

const initialState: ApplicationState = {
  items: [],
  current: null,
  loading: false,
  submitting: false,
  error: null,
};

export const fetchApplicationsByJob = createAsyncThunk(
  "applications/fetchByJob",
  async (jobId: number, thunkApi) => {
    try {
      const response = await api.get<ApplicationListResponse>(
        `/applications/${jobId}/job`,
      );
      return response.data.data;
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message, { description: "Failed to load applications." });
      return thunkApi.rejectWithValue(message);
    }
  },
);

export const fetchApplicationById = createAsyncThunk(
  "applications/fetchById",
  async (applicationId: number, thunkApi) => {
    try {
      const response = await api.get<ApplicationResponse>(
        `/applications/${applicationId}/`,
      );
      return response.data.data;
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message, { description: "Failed to load application." });
      return thunkApi.rejectWithValue(message);
    }
  },
);

export const createApplication = createAsyncThunk(
  "applications/create",
  async (payload: CreateApplicationPayload, thunkApi) => {
    try {
      const response = await api.post<ApplicationResponse>(
        `/applications/${payload.jobId}/`,
        {
          cover_letter: payload.cover_letter,
          links: payload.links,
        },
      );
      toast.success("Application submitted", {
        description: "Your application was sent successfully.",
      });
      return response.data.data;
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message, {
        description: "Could not submit application.",
      });
      return thunkApi.rejectWithValue(message);
    }
  },
);

export const updateApplication = createAsyncThunk(
  "applications/update",
  async (payload: UpdateApplicationPayload, thunkApi) => {
    try {
      const response = await api.put<ApplicationResponse>(
        `/applications/${payload.applicationId}/`,
        {
          cover_letter: payload.cover_letter,
          links: payload.links,
        },
      );
      toast.success("Application updated", {
        description: "Your application was updated successfully.",
      });
      return response.data.data;
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message, {
        description: "Could not update application.",
      });
      return thunkApi.rejectWithValue(message);
    }
  },
);

export const deleteApplication = createAsyncThunk(
  "applications/delete",
  async (applicationId: number, thunkApi) => {
    try {
      const response = await api.delete<ApplicationResponse>(
        `/applications/${applicationId}/`,
      );
      toast.success("Application deleted", {
        description: "Your application was deleted successfully.",
      });
      return response.data.data;
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message, {
        description: "Could not delete application.",
      });
      return thunkApi.rejectWithValue(message);
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async (
    payload: {
      applicationId: number;
      status: "pending" | "approved" | "rejected";
    },
    thunkApi,
  ) => {
    try {
      const response = await api.put<ApplicationResponse>(
        `/applications/${payload.applicationId}/status`,
        {
          status: payload.status,
        },
      );
      toast.success("Application status updated", {
        description: `Status set to ${payload.status}.`,
      });
      return response.data.data;
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message, {
        description: "Could not update application status.",
      });
      return thunkApi.rejectWithValue(message);
    }
  },
);

// candidates/applications

export const fetchCandidateApplications = createAsyncThunk(
  "applications/fetchCandidateApplications",
  async (_, thunkApi) => {
    try {
      const response = await api.get<ApplicationListResponse>(
        `/applications/candidates`,
      );
      return response.data.data;
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message, { description: "Failed to load applications." });
      return thunkApi.rejectWithValue(message);
    }
  },
);

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearApplicationError(state) {
      state.error = null;
    },
    clearCurrentApplication(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicationsByJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationsByJob.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchApplicationsByJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createApplication.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = [action.payload, ...state.items];
        state.current = action.payload;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      .addCase(updateApplication.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.submitting = false;
        state.current = action.payload;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      .addCase(deleteApplication.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id,
        );
        if (state.current?.id === action.payload.id) {
          state.current = null;
        }
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(updateApplicationStatus.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.submitting = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
        if (state.current?.id === action.payload.id) {
          state.current = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchCandidateApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateApplications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCandidateApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearApplicationError, clearCurrentApplication } =
  applicationSlice.actions;

export default applicationSlice.reducer;
