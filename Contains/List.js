import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const listSlice = createSlice({
  name: 'list',
  //state
  initialState: {
    db: null,
    token: '',
    refreshing: null,
    date: null,
    common: null,
    departments: null,
  },
  //reducer
  reducers: {
    setDB(state, action) {
      state.db = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setRefreshing(state, action) {
      state.refreshing = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setCommon(state, action) {
      state.common = action.payload;
    },
    setDepartments(state, action) {
      state.departments = action.payload;
    },
  },
});

//action
export const {
  setDB,
  setToken,
  setRefreshing,
  setDate,
  setCommon,
  setDepartments,
} = listSlice.actions;
export default listSlice.reducer;
