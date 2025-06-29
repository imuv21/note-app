
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './features/reducers/authReducer';
import noteSlice from './features/reducers/noteReducer';

const rootReducer = combineReducers({
  auth: authSlice,
  note: noteSlice
});

export default rootReducer;