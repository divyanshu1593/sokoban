import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../redux-store";
import { jwtDecode } from "jwt-decode";
import { UserJwtPayload } from "../interface/user-jwt-payload.interface";

interface UserState {
  value: string;
}

const initialState: UserState = {
  value: sessionStorage.getItem('userJwt') ?? '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signin: (state, action: PayloadAction<string>) => {
      sessionStorage.setItem('userJwt', action.payload);
      state.value = action.payload;
    },

    signout: (state) => {
      sessionStorage.removeItem('userJwt');
      state.value = '';
    }
  }
});

export const makeSelectPayload = () => {
  const selectPayload = createSelector((state: RootState) => state.user.value, (userJwtToken: string) => {
    if (!userJwtToken) return ;
    return jwtDecode<UserJwtPayload>(userJwtToken);
  });

  return selectPayload;
}

export const { signin, signout } = userSlice.actions;

export default userSlice.reducer;
