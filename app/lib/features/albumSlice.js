import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// Create new album
// Redux thunk to create a new album
export const postNewAlbum = createAsyncThunk(
  'albums/postNewAlbum',
  async (albumData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/stars/albums/create-album', albumData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error occurred while creating the album');
    }
  }
);


// Get all albums
export const getAlbums = createAsyncThunk(
  'albums/getAlbums',
  async ({ page = 1, sortby = 'albumname', sortOrder = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/stars/albums/get-all-albums?sortby=${sortby}&sortOrder=${sortOrder}&page=${page}&limit=12`
      );
      return {
        albums: response.data.albums,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error occurred while fetching albums');
    }
  }
);

// Get album by ID
export const getAlbumById = createAsyncThunk(
  'albums/getAlbumById',
  async (albumId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stars/albums/get-all-albums?albumId=${albumId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error occurred while fetching album');
    }
  }
);

export const albumsSlice = createSlice({
  name: 'albums',
  initialState: {
    albums: [],
    album: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postNewAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postNewAlbum.fulfilled, (state, action) => {
        state.albums.push(action.payload); // Add the newly created album to the list
        state.loading = false;
      })
      .addCase(postNewAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlbums.fulfilled, (state, action) => {
        state.albums = action.payload.albums;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(getAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAlbumById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlbumById.fulfilled, (state, action) => {
        state.album = action.payload;
        state.loading = false;
      })
      .addCase(getAlbumById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default albumsSlice.reducer;
