
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth from '../../services/auth';

export const apiSlice = createApi({
  reducerPath: 'timesheetApi',

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,

    prepareHeaders: (headers) => {
      const token = auth.getAuthToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: [
    'Login',
    'CreateUser',
    'CreateTimesheet',
    'GetMyTimesheets',
    'FindMyTimesheets',
    'GetTimesheetDetails',
    'EmployeesTimesheets',
    'AddTaskToTimesheet',
    'RateTimesheet',
    'TaskStatus', // ✅ NEW
  ],

  endpoints: (build) => ({

    // 🔐 LOGIN
    loginUser: build.mutation({
      query: (payload) => ({
        url: '/login',
        method: 'POST',
        body: payload,
      }),
    }),

    // 👤 CREATE USER (Admin + Manager)
    createUser: build.mutation({
      query: (payload) => ({
        url: '/create-user',
        method: 'POST',
        body: payload,
      }),
    }),

    // 📄 CREATE TIMESHEET (Admin + Manager)
    createTimesheet: build.mutation({
      query: (payload) => ({
        url: '/timesheet',
        method: 'POST',
        body: payload,
      }),
    }),

    // 📄 MY TIMESHEETS
    getMyTimesheets: build.query({
      query: () => '/timesheets',
    }),

    // 🔍 SEARCH MY TIMESHEETS
    findMyTimesheets: build.mutation({
      query: (payload) => ({
        url: '/timesheets',
        method: 'POST',
        body: payload,
      }),
    }),

    // 📄 TIMESHEET DETAILS
    getTimesheetDetails: build.query({
      query: (id) => `/timesheet/${id}`,
      providesTags: ['TaskStatus'],
    }),

    // 👥 EMPLOYEES TIMESHEETS
    getEmployeesTimesheets: build.query({
      query: () => '/employees-timesheets',
    }),

    // ➕ ADD TASK (Admin + Manager)
    addTaskToTimesheet: build.mutation({
      query: (payload) => ({
        url: '/task',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['TaskStatus'],
    }),

    // ✅ UPDATE TASK STATUS (Employee)
    updateTaskStatus: build.mutation({
      query: ({ taskId, status }) => ({
        url: `/task/${taskId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['TaskStatus'],
    }),

    // ⭐ RATE TIMESHEET (Manager)
    rateTimesheet: build.mutation({
      query: ({ timesheetId, rating }) => ({
        url: `/rate-timesheet/${timesheetId}`,
        method: 'POST',
        body: { rating },
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useCreateUserMutation,
  useCreateTimesheetMutation,
  useGetMyTimesheetsQuery,
  useFindMyTimesheetsMutation,
  useGetTimesheetDetailsQuery,
  useGetEmployeesTimesheetsQuery,
  useAddTaskToTimesheetMutation,
  useUpdateTaskStatusMutation, // ✅ THIS FIXES WHITE SCREEN
  useRateTimesheetMutation,
} = apiSlice;
