// features/orders/ordersSlice.tsx
// Kiro Requirement: ORD-1.1, ORD-1.2, ORD-1.3, ORD-1.4 - Order Creation and Management
// Kiro Requirement: ORD-2.2, ORD-2.3 - Payment Status Updates
// Kiro Requirement: ORD-3.1, ORD-3.2, ORD-3.3, ORD-3.4 - Order Tracking and Status Updates

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllPaystackTransaction } from "@/lib/admin/actions";
import { addOrder } from "@/lib/action";

// Order Item Interface
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Shipping Address Interface
export interface ShippingAddress {
  display_name: string;
  variable_name: string;
  value: string;
}

// Order Interface
export interface Order {
  _id?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress[];
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Orders State Interface
interface OrdersState {
  orders: Order[];
  transactions: any[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
}

const initialState: OrdersState = {
  orders: [],
  transactions: [],
  loading: false,
  error: null,
  currentOrder: null,
};

// Async Thunks
export const fetchPaystackTransactions = createAsyncThunk(
  "orders/fetchTransactions",
  async () => {
    const response = await getAllPaystackTransaction();
    return response;
  },
);

export const createNewOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: any, { rejectWithValue }) => {
    try {
      const result = await addOrder(orderData);
      if (result.success) {
        return result.order;
      } else {
        return rejectWithValue(result.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order");
    }
  },
);

// Orders Slice
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set current order for tracking
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
    },

    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    // Update order status locally
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: Order["orderStatus"] }>,
    ) => {
      const order = state.orders.find((o) => o._id === action.payload.orderId);
      if (order) {
        order.orderStatus = action.payload.status;
      }
      if (
        state.currentOrder &&
        state.currentOrder._id === action.payload.orderId
      ) {
        state.currentOrder.orderStatus = action.payload.status;
      }
    },

    // Update payment status locally
    updatePaymentStatus: (
      state,
      action: PayloadAction<{
        orderId: string;
        status: Order["paymentStatus"];
      }>,
    ) => {
      const order = state.orders.find((o) => o._id === action.payload.orderId);
      if (order) {
        order.paymentStatus = action.payload.status;
      }
      if (
        state.currentOrder &&
        state.currentOrder._id === action.payload.orderId
      ) {
        state.currentOrder.paymentStatus = action.payload.status;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchPaystackTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaystackTransactions.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.transactions = action.payload;
        },
      )
      .addCase(fetchPaystackTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch transactions";
      })

      // Create Order
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewOrder.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.orders.push(action.payload);
          state.currentOrder = action.payload;
        },
      )
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentOrder,
  clearCurrentOrder,
  updateOrderStatus,
  updatePaymentStatus,
  clearError,
} = ordersSlice.actions;

export default ordersSlice.reducer;
