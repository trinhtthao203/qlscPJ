import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    taikhoan: 'admin',
    matkhau: 'admin',
    token: '',
    error: '',
    show: '',
  },
  reducers: {
    setTaiKhoan(state, action) {
      state.taikhoan = action.payload;
    },
    setMatKhau(state, action) {
      state.matkhau = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setShow(state, action) {
      state.show = action.payload;
    },
  },
});

export const {setMatKhau, setTaiKhoan, setToken, setError, setShow} =
  loginSlice.actions;
export default loginSlice.reducer;
