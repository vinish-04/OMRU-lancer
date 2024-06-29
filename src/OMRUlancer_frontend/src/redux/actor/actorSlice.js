import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:{}
}

export const actorSlice = createSlice({
  name: 'actor',
  initialState,
  reducers: {
    updateActor: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateActor} = actorSlice.actions

export default actorSlice.reducer