import { createSlice } from "@reduxjs/toolkit";
import { localDataNames } from "../../constants/appInfos";
import { UserType } from "../../@types/user.type";

export interface AuthState {
  token: string;
  user: UserType;
}

const initialState: AuthState = {
  token: "",
  user: {
    id: "",
    username: "",
    roles: [],
    status: true,
    userRoles: undefined,
  },
};

const authSlide = createSlice({
  name: "auth",
  initialState: {
    data: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.data = action.payload;
      syncLocal(action.payload);
    },
    removeAuth: (state) => {
      state.data = initialState;
      syncLocal(initialState);
    },
  },
});

export const authReducer = authSlide.reducer;
export const { addAuth, removeAuth } = authSlide.actions;

export const authSelector = (state: any) => state.authReducer.data;
const syncLocal = async (data: any) => {
  localStorage.setItem(localDataNames.authData, JSON.stringify(data));
};
