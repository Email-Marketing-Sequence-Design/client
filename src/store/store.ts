import { configureStore } from "@reduxjs/toolkit";
import langReducer from "./reducers/language";
export const makeStore = () => {
  return configureStore({
    reducer: { language: langReducer },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
