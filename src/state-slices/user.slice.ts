import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  value: string;
}

const initialState: UserState = {
  value: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signin: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },

    signout: (state) => {
      state.value = '';
    }
  }
});

export const { signin, signout } = userSlice.actions;

export default userSlice.reducer;
