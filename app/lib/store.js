// app/lib/store.js
import { configureStore } from '@reduxjs/toolkit';
import starsSlice from './features/starSlice';
import albumsSlice from './features/albumSlice';
import imageSlice  from './features/imageSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      starsData: starsSlice,
      albumData: albumsSlice,
      imageData: imageSlice,
    },
  });
};

export default makeStore;
