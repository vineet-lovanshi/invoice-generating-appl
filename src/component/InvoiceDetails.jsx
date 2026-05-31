import React from "react";
import {
  markAsPaid,
  deleteInvoice,
  setSelectedInvoice,
  toggleForm,
} from "../store/InvoiceSlice";

import { useDispatch } from "react-redux";

const InvoiceDetails = ({ invoice }) => {
  const dispatch = useDispatch();

  const handleDleteInvoice = () => {
    dispatch(deleteInvoice(invoice.id));
    dispatch(setSelectedInvoice(null));
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 w-full">
      <div
        className="
          flex 
          flex-col 
          lg:flex-row 
          lg:justify-between 
          lg:items-center 
          gap-6 
          mb-8
        "
      >
        <div
          className="
            flex 
            items-center 
            justify-between 
            sm:justify-start 
            gap-4
          "
        >
          <span className="text-sm sm:text-base">Status</span>

          <div
            className={`
              flex 
              items-center 
              gap-2 
              rounded 
              px-4 
              py-2

              ${
                invoice.status === "paid"
                  ? "bg-green-700/50 text-green-50"
                  : invoice.status === "pending"
                    ? "bg-orange-800/30 text-orange-500"
                    : "bg-slate-700/50 text-slate-400"
              }
            `}
          >
            <div
              className={`
                w-2 
                h-2 
                rounded-full

                ${
                  invoice.status === "paid"
                    ? "bg-green-500"
                    : invoice.status === "pending"
                      ? "bg-orange-500"
                      : "bg-slate-400"
                }
              `}
            ></div>

            <span className="capitalize text-sm sm:text-base">
              {invoice.status}
            </span>
          </div>
        </div>

        <div
          className="
            flex 
            flex-wrap 
            gap-3
          "
        >
          <button
            onClick={() => dispatch(toggleForm())}
            className="
              px-5 
              sm:px-6 
              py-3 
              rounded-full 
              bg-slate-700 
              hover:bg-slate-600 
              cursor-pointer 
              transition-all
              text-sm
              sm:text-base
            "
          >
            Edit
          </button>

          <button
            onClick={handleDleteInvoice}
            className="
              px-5 
              sm:px-6 
              py-3 
              rounded-full 
              bg-red-500 
              hover:bg-red-600 
              cursor-pointer 
              transition-all
              text-sm
              sm:text-base
            "
          >
            Delete
          </button>

          <button
            onClick={() => dispatch(markAsPaid(invoice.id))}
            className="
              px-5 
              sm:px-6 
              py-3 
              rounded-full 
              bg-violet-500 
              hover:bg-violet-700 
              cursor-pointer 
              transition-all
              text-sm
              sm:text-base
            "
          >
            Mark as Paid
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg p-4 sm:p-8">
        <div
          className="
            flex 
            flex-col 
            md:flex-row 
            md:justify-between 
            gap-6 
            mb-8
          "
        >
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-2">#{invoice.id}</h2>

            <p className="text-slate-400 break-words">{invoice.projectDesc}</p>
          </div>

          <div
            className="
              text-left 
              md:text-right 
              text-slate-400
              text-sm
              sm:text-base
            "
          >
            <p>{invoice.billFrom.streetAdd}</p>
            <p>{invoice.billFrom.city}</p>
            <p>{invoice.billFrom.postCode}</p>
            <p>{invoice.billFrom.country}</p>
          </div>
        </div>

        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            gap-8 
            mb-8
          "
        >
          <div>
            <p className="text-slate-400 mb-2 text-sm sm:text-base">
              Invoice Date
            </p>

            <p className="font-bold mb-6">{invoice.date}</p>

            <p className="text-slate-400 mb-2 text-sm sm:text-base">
              Payment Due
            </p>

            <p className="font-bold">{invoice.dueDate}</p>
          </div>

          <div>
            <p className="text-slate-400 mb-2 text-sm sm:text-base">Bill To</p>

            <p className="font-bold mb-2">{invoice.clientName}</p>

            <p className="text-slate-400 mb-2 break-words">
              {invoice.billTo.clientStreetAdd}
            </p>

            <p className="text-slate-400 mb-2">{invoice.billTo.city}</p>

            <p className="text-slate-400 mb-2">{invoice.billTo.postCode}</p>

            <p className="text-slate-400 mb-2">{invoice.billTo.country}</p>
          </div>

          <div>
            <p className="text-slate-400 mb-2 text-sm sm:text-base">Sent To</p>

            <p className="font-bold break-words">
              {invoice.billTo.clientEmail}
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-slate-400 text-sm sm:text-base">
                  <th className="text-left p-4">SQ.</th>
                  <th className="text-left p-4">Item Name</th>
                  <th className="text-center p-4">Quantity</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-right p-4">Total</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="text-white text-sm sm:text-base">
                    <td className="p-4">{index + 1}</td>

                    <td className="p-4">{item.name}</td>

                    <td className="text-center p-4">{item.quantity}</td>

                    <td className="text-right p-4">₹ {item.price}</td>

                    <td className="text-right p-4">
                      ₹ {item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="
              bg-slate-900 
              p-4 
              sm:p-8 
              flex 
              items-center 
              justify-between
            "
          >
            <span className="text-white text-sm sm:text-base">
              {invoice.status === "paid" ? "Amount Paid" : "Amount Due"}
            </span>

            <span className="text-2xl sm:text-3xl font-bold">
              ₹ {invoice.amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
