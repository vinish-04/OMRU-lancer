import { configureStore } from '@reduxjs/toolkit'
import actorReducer from "./actor/actorSlice"
import userReducer from './user/userSlice'
import jobReducer from './job/jobSlice'

export const store = configureStore({
    reducer: {
        actor: actorReducer,
        user: userReducer,
        job: jobReducer
    },
})

// https://stackoverflow.com/questions/54385323/what-is-a-difference-between-action-reducer-and-store-in-redux