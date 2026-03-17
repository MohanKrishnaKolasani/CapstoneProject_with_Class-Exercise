import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    return [
      { id: 1, name: "Laptop", price: 50000 },
      { id: 2, name: "Mobile", price: 20000 },
    ];
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {
    updateProduct: (state, action) => {
      const { id, price } = action.payload;
      const product = state.items.find((p) => p.id === id);
      if (product) {
        product.price = price;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      });
  },
});

export const { updateProduct } = productSlice.actions;
export default productSlice.reducer;