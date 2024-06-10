import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  description: "",
  difficulty: "Easy",
  constraints: "",
  topic: "",
  initialCode: "",
  boilerPlate: "",
  testCase: [{ input: "", output: "" }],
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addTestCase: (state) => {
      state.testCase.push({ input: "", output: "" });
    },
    updateTestCase: (state, action) => {
      const { index, field, value } = action.payload;
      state.testCase[index][field] = value;
    },
    removeTestCase: (state, action) => {
      state.testCase.splice(action.payload, 1);
    },
  },
});

export const { setField, addTestCase, updateTestCase, removeTestCase } =
  questionSlice.actions;

export default questionSlice.reducer;
