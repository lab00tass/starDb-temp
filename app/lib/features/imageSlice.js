import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// get all images
export const getAllImages = createAsyncThunk(
    "images/getImages",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/stars/images/get-all-images?`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error occurred while fetching images");
        }
    }
)

export const imageSlice = createSlice({
    name: "images",
    initialState: {
      allImages: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAllImages.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllImages.fulfilled, (state, action) => {
          state.allImages = action.payload; // Ensure payload data structure matches
          state.loading = false;
        })
        .addCase(getAllImages.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default imageSlice.reducer;  