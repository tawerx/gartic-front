import { configureStore } from '@reduxjs/toolkit';
import logic from './slices/logicSlice';

export const store = configureStore({
  reducer: { logic },
});
