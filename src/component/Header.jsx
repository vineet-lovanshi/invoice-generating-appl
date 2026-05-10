import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { Filter, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../store/InvoiceSlice";

const status = ["all", "paid", "pending", "draft"];

const Header = ({ onNewInvoice }) => {
  const { invoice, filter } = useSelector((state) => state.invoices);

  const dispatch = useDispatch();

  return (
    <div
      className="
        flex 
        flex-col 
        sm:flex-row 
        sm:items-center 
        sm:justify-between 
        gap-6 
        mb-10
      "
    >
      <div>
        <h1
          className="
            text-2xl 
            sm:text-3xl 
            font-bold 
            text-white 
            mb-2
          "
        >
          Invoices
        </h1>

        <p className="text-slate-400 text-sm sm:text-base">
          {invoice.length === 0
            ? "No Invoices"
            : `There are Total ${invoice.length} Invoice`}
        </p>
      </div>

      <div
        className="
          flex 
          items-center 
          justify-between 
          sm:justify-end 
          gap-4
        "
      >
        <Menu as="div" className="relative">
          <MenuButton
            className="
              flex 
              items-center 
              gap-2 
              text-white 
              cursor-pointer
              text-sm
              sm:text-base
            "
          >
            <Filter size={18} />

            <span className="hidden sm:block">Filter by Status</span>

            <span className="sm:hidden">Filter</span>
          </MenuButton>

          <MenuItems
            className="
              absolute 
              right-0 
              mt-3 
              w-40 
              bg-slate-800 
              rounded-lg 
              shadow-lg 
              overflow-hidden
              z-50
            "
          >
            {status.map((s) => (
              <MenuItem key={s}>
                <Button
                  onClick={() => dispatch(setFilter(s))}
                  className={`
                    w-full 
                    text-left 
                    px-4 
                    py-3 
                    capitalize 
                    cursor-pointer 
                    transition-colors
                    hover:bg-slate-700

                    ${filter === s ? "text-violet-500" : "text-white"}
                  `}
                >
                  {s}
                </Button>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        <Button
          type="button"
          onClick={onNewInvoice}
          className="
            bg-violet-500 
            hover:bg-violet-700 
            transition-colors
            text-white 
            px-3 
            sm:px-4 
            py-2 
            rounded-full 
            flex 
            items-center 
            gap-2 
            cursor-pointer
          "
        >
          <div
            className="
              bg-white 
              p-2 
              rounded-full
            "
          >
            <Plus size={16} className="text-violet-500" />
          </div>

          <span
            className="
              text-sm 
              sm:text-base
            "
          >
            New Invoice
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
