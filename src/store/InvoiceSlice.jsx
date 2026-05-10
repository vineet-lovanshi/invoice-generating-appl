import { createSlice } from "@reduxjs/toolkit";
import { addDays, format } from "date-fns";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    // console.log(serializedState);

    if (serializedState === null) return undefined;

    return JSON.parse(serializedState);
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const persistedState = loadState();

const initialState = persistedState || {
  invoice: [],
  filter: "all",
  isFormOpen: false,
  selectedInvoice: null,
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (error) {
    console.log(error);
  }
};

const calculateAmount = (items) => {
  return items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    addInvoice: (state, action) => {
      const newInvoice = {
        ...action.payload,
        amount: calculateAmount(action.payload.items),
        status: action.payload.status || "pending",
        dueDate:
          action.payload.dueDate ||
          format(addDays(new Date(), 30), "yyyy-MM-dd"),
      };

      state.invoice.push(newInvoice);

      saveState(state);

      state.isFormOpen = false;
    },
    updateInvoice: (state, action) => {
      state.invoice = state.invoice.map((inv) =>
        inv.id === action.payload.id ? action.payload : inv,
      );

      state.isFormOpen = false;
      state.selectedInvoice = null;

      saveState(state);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    toggleForm: (state) => {
      state.isFormOpen = !state.isFormOpen;

      if (!state.isFormOpen) {
        state.selectedInvoice = null;
      }
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
      state.isFormOpen = false;
    },
    markAsPaid: (state, action) => {
      const invoice = state.invoice.find((inv) => inv.id === action.payload);

      if (invoice) {
        invoice.status = "paid";
        state.selectedInvoice = null;
        state.isFormOpen = false;
        saveState(state);
      }
    },
    deleteInvoice: (state, action) => {
      state.invoice = state.invoice.filter((inv) => inv.id !== action.payload);
      state.selectedInvoice = null;
      saveState(state);
    },
  },
});

export const {
  toggleForm,
  addInvoice,
  setFilter,
  setSelectedInvoice,
  markAsPaid,
  deleteInvoice,
  updateInvoice,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
