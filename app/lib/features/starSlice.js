import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance"; // Use the correct axios instance

// Create a new star
export const postNewStar = createAsyncThunk(
  "stars/postNewStar",
  async (starData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/stars/create-star/create-new-star", starData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while creating the star");
    }
  }
);

// Update an existing star
export const updateStar = createAsyncThunk(
  "stars/updateStar",
  async ({ starId, starData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/stars/create-star/update-star/${starId}`, starData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while updating the star");
    }
  }
);

// Get all stars with pagination and sorting
export const getAllStars = createAsyncThunk(
  "stars/getAllStars",
  async ({ page, limit, sortby, sortOrder }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stars/create-star/get-all-star?sorttype=${sortby}&sortval=${sortOrder}&page=${page}&limit=${limit}&homestar=true`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while fetching stars");
    }
  }
);

// Get a single star by starId
export const getStarById = createAsyncThunk(
  "stars/getSingleStarById",
  async (starId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stars/create-star/get-all-star?starId=${starId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while fetching the star");
    }
  }
);

// Get searched stars by query
export const getSearchedStar = createAsyncThunk(
  "stars/getSearchedStar",
  async (queryStar, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stars/create-star/get-all-star?limit=5&onlystar=true&sorttype=starname&sortval=asc&querystar=${queryStar}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while searching for stars");
    }
  }
);

// Get star names for selection
export const getStarNamesSelect = createAsyncThunk(
  "stars/getStarNamesSelect",
  async (selectStar, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stars/create-star/get-all-star?onlystar=true&limit=6&sorttype=starname&sortval=asc&querystar=${selectStar}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while fetching star names");
    }
  }
);

// Get the last created stars
export const getLastCreatedStar = createAsyncThunk(
  "stars/getLastCreatedStar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stars/create-star/get-all-star?homestar=true&limit=7&sorttype=updatedAt&sortval=des`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while fetching the latest stars");
    }
  }
);

// Get star for album
export const getStarForAlbum = createAsyncThunk(
  "stars/getStarForAlbum",
  async (starId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/stars/create-star/get-all-star?starId=${starId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error occurred while fetching the star");
    }
  }
);

// Redux Slice
export const starsSlice = createSlice({
  name: "stars",
  initialState: {
    allStars: {
      data: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10
    },
    singleStar: null,
    albumStar: null,
    queryStar: [],
    selectStar: [],
    lastCreatedStar: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 7, data: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle postNewStar
      .addCase(postNewStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postNewStar.fulfilled, (state, action) => {
        state.loading = false;
        state.stars.push(action.payload);
      })
      .addCase(postNewStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateStar
      .addCase(updateStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStar.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.stars.findIndex((star) => star._id === action.payload._id);
        if (index !== -1) {
          state.stars[index] = action.payload;
        }
      })
      .addCase(updateStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAllStars
      .addCase(getAllStars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStars.fulfilled, (state, action) => {
        state.loading = false;
        state.allStars.data = action.payload.data;
        state.allStars.totalItems = action.payload.totalItems;
        state.allStars.totalPages = action.payload.totalPages;
        state.allStars.currentPage = action.payload.currentPage;
        state.allStars.limit = action.payload.limit;
      })
      .addCase(getAllStars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getStarById
      .addCase(getStarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStarById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleStar = action.payload;
      })
      .addCase(getStarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getSearchedStar
      .addCase(getSearchedStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchedStar.fulfilled, (state, action) => {
        state.loading = false;
        state.queryStar = action.payload;
      })
      .addCase(getSearchedStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getStarNamesSelect
      .addCase(getStarNamesSelect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStarNamesSelect.fulfilled, (state, action) => {
        state.loading = false;
        state.selectStar = action.payload;
      })
      .addCase(getStarNamesSelect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getLastCreatedStar
      .addCase(getLastCreatedStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLastCreatedStar.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreatedStar = action.payload;
      })
      .addCase(getLastCreatedStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getStarForAlbum
      .addCase(getStarForAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStarForAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albumStar = action.payload;
      })
      .addCase(getStarForAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default starsSlice.reducer;
