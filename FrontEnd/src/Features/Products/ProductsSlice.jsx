import { createSlice } from "@reduxjs/toolkit";
import { actGetProducts } from "./actions/actGetProducts";

const initialState = {
  data: {
    pagination: {
      page: 1,
      limit: 10,
      total: 5,
      totalPages: 1,
    },
    products: [],
  },
  selectedSizeAndColorAndTaille: {
    taille: null,
    size: null,
    color: { colorIndex: null, colorHex: null },
    pack: [{ id: 2, quantity: 2 }],
  },
  isLoading: true,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    selectColor: (state, action) => {
      state.selectedSizeAndColorAndTaille.color = action.payload;
    },
    selectSize: (state, action) => {
      state.selectedSizeAndColorAndTaille.size = action.payload;
    },
    selectTaille: (state, action) => {
      state.selectedSizeAndColorAndTaille.taille = action.payload;
    },
    selectPack: (state, action) => {
      const { id, quantity } = action.payload;
      const existingPack = state.selectedSizeAndColorAndTaille.pack.find(
        (p) => p.id === id
      );

      if (existingPack) {
        existingPack.quantity = quantity;
      } else {
        state.selectedSizeAndColorAndTaille.pack.push({ id, quantity });
      }
    },
    clearSelections: (state) => {
      state.selectedSizeAndColorAndTaille = {
        taille: null,
        size: null,
        color: { colorIndex: null, colorHex: null },
        pack: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(actGetProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(actGetProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectColor,
  selectSize,
  selectTaille,
  selectPack,
  clearSelections,
} = productsSlice.actions;

export default productsSlice.reducer;
