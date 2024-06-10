// src/redux/slices/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const apiSlice = createApi({
  reducerPath: "ojApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://65.0.6.241:8080/api",
    prepareHeaders: (headers, { getState, endpoint }) => {
      if (endpoint !== "/login" && endpoint !== "/register") {
        const token = Cookies.get("token"); // Use 'token' as a string instead of a variable

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          Cookies.remove("token");
        } catch (err) {
          console.error("Logout failed: ", err);
          toast.error("Logout failed: ", err);
        }
      },
    }),
    addQuestion: builder.mutation({
      query: (quesData) => ({
        url: "/questions/create",
        method: "POST",
        body: quesData,
      }),
    }),
    updateQuestion: builder.mutation({
      query: (quesData) => ({
        url: `/questions/${quesData._id}`,
        method: "PUT",
        body: quesData,
      }),
    }),
    deleteQuestion: builder.mutation({
      query: (quesId) => ({
        url: `/questions/${quesId}`,
        method: "DELETE",
      }),
    }),
    runtestCaseQuestion: builder.mutation({
      query: (quesData) => ({
        url: "/solutions/run",
        method: "POST",
        body: quesData,
      }),
    }),
    submitQuestion: builder.mutation({
      query: (quesData) => ({
        url: "/solutions/submit",
        method: "POST",
        body: quesData,
      }),
    }),
    getQuestion: builder.query({
      query: (quesId) => ({
        url: `/questions/${quesId}`,
      }),
    }),
    getAllQuestion: builder.query({
      query: () => ({
        url: `/questions/all`,
      }),
    }),
    getSolutions: builder.query({
      query: (userId) => ({
        url: `/solutions/submitted-questions/${userId}`,
      }),
    }),
    getShowSubmission: builder.query({
      query: ({ userId, questionId }) => ({
        url: `/solutions/submission/${userId}/${questionId}`,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useRuntestCaseQuestionMutation,
  useSubmitQuestionMutation,
  useGetQuestionQuery,
  useGetAllQuestionQuery,
  useGetSolutionsQuery,
  useGetShowSubmissionQuery,
} = apiSlice;
