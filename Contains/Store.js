import {configureStore} from '@reduxjs/toolkit';
import listReducer from './List';
import loginReducer from './Login';

export const store = configureStore({
  reducer: {
    list: listReducer,
    login: loginReducer,
  },
});
