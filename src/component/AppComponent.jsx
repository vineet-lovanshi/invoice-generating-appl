import React from "react";
import Header from "./Header";
import InvoiceList from "./InvoiceList";
import InvoiceForm from "./InvoiceForm";
import { useDispatch, useSelector } from "react-redux";
import { toggleForm } from "../store/InvoiceSlice";
import InvoiceDetails from "./InvoiceDetails";

const AppComponent = () => {
  const dispatch = useDispatch();
  const { isFormOpen, selectedInvoice } = useSelector(
    (state) => state.invoices,
  );

  // const handleNewInvoice = () => {
  //   dispatch(toggleForm());
  //   console.log("Click");
  // };
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <Header onNewInvoice={() => dispatch(toggleForm())}></Header>

        {selectedInvoice ? (
          <InvoiceDetails invoice={selectedInvoice}></InvoiceDetails>
        ) : (
          <InvoiceList></InvoiceList>
        )}
        {isFormOpen && (
          <InvoiceForm
            invoice={selectedInvoice}
            onNewInvoice={() => dispatch(toggleForm())}
          ></InvoiceForm>
        )}
      </div>
    </div>
  );
};

export default AppComponent;
