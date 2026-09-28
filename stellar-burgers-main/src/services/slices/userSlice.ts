import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface IUserState {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
}

interface IAuthResponse {
  user: TUser;
  accessToken: string;
  refreshToken: string;
}

interface IUserResponse {
  user: TUser;
}

const initialState: IUserState = {
  isAuthChecked: false,
  user: null,
  error: null
};

export const registerUser = createAsyncThunk<
  IAuthResponse,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    return response as unknown as IAuthResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка регистрации');
  }
});

export const loginUser = createAsyncThunk<
  IAuthResponse,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    return response as unknown as IAuthResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка входа');
  }
});

export const getUser = createAsyncThunk<
  IUserResponse,
  void,
  { rejectValue: string }
>('user/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    return response as unknown as IUserResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка получения пользователя');
  }
});

export const updateUser = createAsyncThunk<
  IUserResponse,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response as unknown as IUserResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ошибка обновления');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка выхода');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthChecked = true;
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isAuthChecked = true;
          state.user = action.payload.user;
          state.error = null;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })

      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.isAuthChecked = true;
          state.user = action.payload.user;
          state.error = null;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = (action.payload as string) || 'Ошибка входа';
      })

      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<IUserResponse>) => {
          state.isAuthChecked = true;
          state.user = action.payload.user;
          state.error = null;
        }
      )
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      })

      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<IUserResponse>) => {
          state.user = action.payload.user;
          state.error = null;
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Ошибка обновления';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
