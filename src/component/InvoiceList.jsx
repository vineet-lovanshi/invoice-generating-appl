import { format, parseISO } from "date-fns";
import { ChevronRight } from "lucide-react";
import React from "react";
import { setSelectedInvoice } from "../store/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";

const InvoiceList = () => {
  const { invoice, filter } = useSelector((state) => state.invoices);

  const dispatch = useDispatch();

  const filterInvoice = invoice.filter((invoice) => {
    if (filter === "all") return true;

    return invoice.status === filter;
  });

  if (filterInvoice.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg sm:text-xl text-slate-400">No Invoice Found</p>
      </div>
    );
  }

  const formatDate = (date) => {
    try {
      return format(parseISO(date), "dd-MM-yyyy");
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvoiceClick = (invoice) => {
    dispatch(setSelectedInvoice(invoice));
  };

  return (
    <div className="space-y-4 mt-8">
      {filterInvoice.map((invoice) => (
        <div
          key={invoice.id}
          onClick={() => handleInvoiceClick(invoice)}
          className="
            bg-slate-800
            rounded-lg
            p-5
            sm:p-6
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
            hover:bg-slate-700
            transition-colors
            duration-200
            cursor-pointer
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              gap-3
              sm:gap-6
            "
          >
            <span
              className="
                text-white
                font-bold
                text-sm
                sm:text-base
              "
            >
              #{invoice.id}
            </span>

            <span
              className="
                text-slate-400
                text-sm
              "
            >
              Due {formatDate(invoice.dueDate)}
            </span>

            <span
              className="
                text-slate-300
                text-sm
                sm:text-base
              "
            >
              {invoice.clientName}
            </span>
          </div>

          <div
            className="
              flex
              items-center
              justify-between
              sm:justify-end
              gap-4
              sm:gap-6
              flex-wrap
            "
          >
            <span
              className="
                text-lg
                sm:text-xl
                font-bold
                text-white
              "
            >
              ₹ {invoice.amount?.toFixed(2) || "0.00"}
            </span>

            <div
              className={`
                flex
                items-center
                gap-2
                rounded
                px-4
                py-2
                min-w-27.5
                justify-center

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

              <span className="capitalize text-sm">{invoice.status}</span>
            </div>

            <ChevronRight
              className="
                text-violet-500
                hidden
                sm:block
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvoiceList;
