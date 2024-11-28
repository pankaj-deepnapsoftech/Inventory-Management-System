import { configureStore } from "@reduxjs/toolkit";
import {agentApi, api, bomApi, employeeApi, productApi, storeApi, userRoleApi} from "./api/api";
import authSlice from "./reducers/authSlice";
import drawersSlice from "./reducers/drawersSlice";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [drawersSlice.name]: drawersSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat([productApi.middleware, storeApi.middleware, agentApi.middleware, bomApi.middleware, userRoleApi.middleware, employeeApi.middleware])
});

export default store;
