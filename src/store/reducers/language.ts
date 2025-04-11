import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface LangState {
  i18LangStatus: string;
}

const initialState: LangState = {
  i18LangStatus: "en",
};

const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.i18LangStatus = action.payload;
    },
  },
});

export const { setLanguage } = langSlice.actions;

export default langSlice.reducer;

export const selectLanguage = (state: RootState) =>
  state.language.i18LangStatus;
