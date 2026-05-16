import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { api, getApiErrorMessage } from "@/utils/api";
import type { Notification } from "@/components/NotificationBell";

type ApiNotification = {
  id: number | string;
  title: string;
  body: string;
  read: boolean;
  created_at?: string;
};

type NotificationState = {
  items: Notification[];
  isLoading: boolean;
  error: string | null;
};

const initialState: NotificationState = {
  items: [],
  isLoading: false,
  error: null,
};

function mapApiNotification(item: ApiNotification): Notification {
  return {
    id: String(item.id),
    title: item.title,
    description: item.body,
    timestamp: item.created_at ? new Date(item.created_at) : new Date(),
    read: Boolean(item.read),
  };
}

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notification/fetchAll", async (_, thunkApi) => {
  try {
    const res = await api.get<ApiNotification[]>("/notifications");
    const items = res.data.map(mapApiNotification);
    items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return items;
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const markNotificationRead = createAsyncThunk<
  Notification,
  string,
  { rejectValue: string }
>("notification/markRead", async (id, thunkApi) => {
  try {
    const res = await api.put<ApiNotification>(`/notifications/${id}`, {
      read: true,
    });
    return mapApiNotification(res.data);
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const markAllNotificationsRead = createAsyncThunk<
  string[],
  void,
  { state: RootState; rejectValue: string }
>("notification/markAllRead", async (_, thunkApi) => {
  try {
    const unread = thunkApi
      .getState()
      .notification.items.filter((item) => !item.read)
      .map((item) => item.id);

    await Promise.all(
      unread.map((id) =>
        api.put(`/notifications/${id}`, {
          read: true,
        }),
      ),
    );

    return unread;
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

export const deleteNotification = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notification/delete", async (id, thunkApi) => {
  try {
    await api.delete(`/notifications/${id}`);
    return id;
  } catch (err) {
    return thunkApi.rejectWithValue(getApiErrorMessage(err));
  }
});

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addRealtimeNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
    },
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load notifications";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const next = action.payload;
        const index = state.items.findIndex((item) => item.id === next.id);
        if (index >= 0) state.items[index] = next;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        const ids = new Set(action.payload);
        state.items = state.items.map((item) =>
          ids.has(item.id) ? { ...item, read: true } : item,
        );
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { addRealtimeNotification, clearNotificationError } =
  notificationSlice.actions;

export const selectNotifications = (state: RootState) =>
  state.notification.items;
export const selectNotificationLoading = (state: RootState) =>
  state.notification.isLoading;

export default notificationSlice.reducer;
