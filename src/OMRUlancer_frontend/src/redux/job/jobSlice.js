import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:{}
}

export const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    updateJob: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateJob} = jobSlice.actions

export default jobSlice.reducer