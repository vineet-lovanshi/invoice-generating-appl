import { Plus, Trash2, X } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addInvoice, toggleForm, updateInvoice } from "../store/InvoiceSlice";
import { useFieldArray, useForm } from "react-hook-form";
import { addDays, format } from "date-fns";

const InvoiceForm = ({ invoice }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ name: "", quantity: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  useEffect(() => {
    if (invoice) {
      setValue("streetAdd", invoice.billFrom.streetAdd);
      setValue("city", invoice.billFrom.city);
      setValue("postCode", invoice.billFrom.postCode);
      setValue("country", invoice.billFrom.country);

      setValue("clientName", invoice.billTo.clientName);
      setValue("clientEmail", invoice.billTo.clientEmail);
      setValue("clientStreetAdd", invoice.billTo.clientStreetAdd);
      setValue("clientCity", invoice.billTo.city);
      setValue("clientPostCode", invoice.billTo.postCode);
      setValue("clientCountry", invoice.billTo.country);

      setValue("projectDesc", invoice.projectDesc);
      setValue("date", invoice.date);
      setValue("paymentTerms", invoice.paymentTerms);

      setValue("items", invoice.items);
    }
  }, [invoice, setValue]);

  const submitForm = (data) => {
    const updatedItems = data.items.map((item) => {
      const totalPrice = item.quantity * item.price;

      return {
        ...item,
        totalPrice,
      };
    });

    const finalData = {
      id: invoice
        ? invoice.id
        : "INV-" + Math.floor(1000 + Math.random() * 9000),

      status: invoice ? invoice.status : "pending",

      billFrom: {
        streetAdd: data.streetAdd,
        city: data.city,
        postCode: data.postCode,
        country: data.country,
      },

      billTo: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientStreetAdd: data.clientStreetAdd,
        postCode: data.clientPostCode,
        country: data.clientCountry,
        city: data.clientCity,
      },

      clientName: data.clientName,

      items: updatedItems,

      paymentTerms: data.paymentTerms,

      projectDesc: data.projectDesc,

      date: data.date,

      dueDate: invoice
        ? invoice.dueDate
        : format(addDays(new Date(), 30), "yyyy-MM-dd"),

      amount: updatedItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0,
      ),
    };

    if (invoice) {
      dispatch(updateInvoice(finalData));
    } else {
      dispatch(addInvoice(finalData));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center overflow-y-auto z-50 px-3 sm:px-6">
      <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-4xl mt-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            {invoice ? "Edit Invoice" : "New Invoice"}
          </h2>

          <button
            onClick={() => dispatch(toggleForm())}
            className="cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-violet-500 font-bold">Bill From</h3>

            <input
              type="text"
              placeholder="Street Address"
              {...register("streetAdd", {
                required: "Street address is required",
              })}
              className={`w-full bg-slate-900 rounded-lg p-3 text-sm sm:text-base ${
                errors.streetAdd
                  ? "border border-red-500"
                  : "border border-gray-600"
              }`}
            />

            {errors.streetAdd && (
              <p className="text-red-500 text-sm">{errors.streetAdd.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="City"
              {...register("city", {
                required: "City is required",
              })}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />

            <input
              type="text"
              placeholder="Post Code"
              {...register("postCode", {
                required: "Post code is required",
              })}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />

            <input
              type="text"
              placeholder="Country"
              {...register("country", {
                required: "Country is required",
              })}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-violet-500 font-bold">Bill To</h3>

            <input
              type="text"
              placeholder="Client Name"
              {...register("clientName", {
                required: "Client name is required",
              })}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />

            <input
              type="email"
              placeholder="Client Email"
              {...register("clientEmail", {
                required: "Email is required",
              })}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />

            <input
              type="text"
              placeholder="Street Address"
              {...register("clientStreetAdd", {
                required: "Street address is required",
              })}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="City"
              {...register("clientCity")}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />

            <input
              type="text"
              placeholder="Post Code"
              {...register("clientPostCode")}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />

            <input
              type="text"
              placeholder="Country"
              {...register("clientCountry")}
              className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              {...register("date")}
              className="w-full h-12 bg-slate-900 rounded-lg px-3 border border-gray-600"
            />

            <select
              {...register("paymentTerms")}
              className="w-full h-12 bg-slate-900 rounded-lg px-3 border border-gray-600"
            >
              <option>Net 30 Days</option>
              <option>Net 60 Days</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Project Description"
            {...register("projectDesc")}
            className="w-full bg-slate-900 rounded-lg p-3 border border-gray-600"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Item List</h3>

            {fields.map((item, index) => (
              <div key={item.id} className=" p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Item Name"
                    {...register(`items.${index}.name`)}
                    className="w-full bg-slate-900 rounded-lg p-3 md:col-span-5 border border-gray-600"
                  />

                  <input
                    type="number"
                    placeholder="Quantity"
                    {...register(`items.${index}.quantity`)}
                    className="w-full bg-slate-900 rounded-lg p-3 md:col-span-2 border border-gray-600"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    {...register(`items.${index}.price`)}
                    className="w-full bg-slate-900 rounded-lg p-3 md:col-span-2 border border-gray-600"
                  />

                  <div className="md:col-span-2 text-left md:text-right font-semibold">
                    ₹{" "}
                    {items[index]?.quantity && items[index]?.price
                      ? items[index].quantity * items[index].price
                      : 0}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (fields.length === 1) {
                        setValue(`items.${index}`, {
                          name: "",
                          quantity: "",
                          price: "",
                        });
                      } else {
                        remove(index);
                      }
                    }}
                    className="text-slate-400 hover:text-red-500 cursor-pointer md:col-span-1 flex justify-start md:justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  quantity: "",
                  price: "",
                })
              }
              className="w-full cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-lg p-3 flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Item</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => dispatch(toggleForm())}
              className="w-full sm:w-auto cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-full px-6 py-3 text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto cursor-pointer bg-violet-500 hover:bg-violet-600 rounded-full px-6 py-3 text-white"
            >
              {invoice ? "Edit" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
