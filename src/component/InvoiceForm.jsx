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
      items: [{ name: "", quantity: "", price: "", totalPrice: "" }],
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center  z-50 px-3 sm:px-5 overflow-y-auto overflow-x-hidden">
      <div className="bg-slate-800 w-full max-w-4xl rounded-lg p-4 sm:p-6 md:p-8 mt-5 mb-5 overflow-x-hidden">
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
                minLength: {
                  value: 5,
                  message: "Minimum 5 characters are required",
                },
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
            <div>
              <input
                type="text"
                {...register("city", {
                  required: "City name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters are required",
                  },
                })}
                placeholder="City"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.city
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.city && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("postCode", {
                  required: "Post code is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters are required",
                  },
                })}
                placeholder="Post Code"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.postCode
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.postCode && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.postCode.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("country", {
                  required: "Country name is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters are required",
                  },
                })}
                placeholder="Country"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.country
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.country && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-violet-500 font-bold">Bill To</h3>

            <div>
              <input
                type="text"
                {...register("clientName", {
                  required: "Client name is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters are required",
                  },
                })}
                placeholder="Client's Name"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.clientName
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.clientName && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                {...register("clientEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Client's Email"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.clientEmail
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.clientEmail && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("clientStreetAdd", {
                  required: "Street address is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters are required",
                  },
                })}
                placeholder="Street Address"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.clientStreetAdd
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.clientStreetAdd && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.clientStreetAdd.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                {...register("clientCity", {
                  required: "City name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters are required",
                  },
                })}
                placeholder="City"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.clientCity
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.clientCity && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.clientCity.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("clientPostCode", {
                  required: "Post code is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters are required",
                  },
                })}
                placeholder="Post Code"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.clientPostCode
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.clientPostCode && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.clientPostCode.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("clientCountry", {
                  required: "Country name is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters are required",
                  },
                })}
                placeholder="Country"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.clientCountry
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.clientCountry && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.clientCountry.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  {...register("date", {
                    required: "Date is required",
                  })}
                  className={`w-full h-12 bg-slate-900 rounded-lg px-3 cursor-pointer ${
                    errors.date
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                />

                {errors.date && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <select
                  {...register("paymentTerms")}
                  className="w-full h-12 bg-slate-900 rounded-lg px-3 cursor-pointer border border-gray-600"
                >
                  <option>Net 30 Days</option>
                  <option>Net 60 Days</option>
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                {...register("projectDesc", {
                  required: "Project description is required",
                  minLength: {
                    value: 10,
                    message: "Minimum 10 characters are required",
                  },
                })}
                placeholder="Project Description"
                className={`w-full bg-slate-900 rounded-lg p-3 ${
                  errors.projectDesc
                    ? "border border-red-500"
                    : "border border-gray-600"
                }`}
              />

              {errors.projectDesc && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.projectDesc.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Item List</h3>

            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
              >
                <input
                  type="text"
                  placeholder="Item Name"
                  {...register(`items.${index}.name`, {
                    required: "Item name is required",
                  })}
                  className={`w-full bg-slate-900 rounded-lg p-3 lg:col-span-5 ${
                    errors?.items?.[index]?.name
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  {...register(`items.${index}.quantity`, {
                    required: "Quantity is required",
                  })}
                  className={`w-full bg-slate-900 rounded-lg p-3 lg:col-span-2 ${
                    errors?.items?.[index]?.quantity
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                />

                <input
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="1"
                  {...register(`items.${index}.price`, {
                    required: "Price is required",
                  })}
                  className={`w-full bg-slate-900 rounded-lg p-3 lg:col-span-2 ${
                    errors?.items?.[index]?.price
                      ? "border border-red-500"
                      : "border border-gray-600"
                  }`}
                />

                <div className="lg:col-span-2 text-left lg:text-right font-semibold">
                  ₹{" "}
                  {items[index]?.quantity && items[index]?.price
                    ? items[index].quantity * items[index].price
                    : 0}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const currentItem = items[index];

                    if (
                      !currentItem?.name &&
                      !currentItem?.quantity &&
                      !currentItem?.price
                    ) {
                      alert("Fill up the current items");
                      return;
                    }

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
                  className="text-slate-400 hover:text-red-500 cursor-pointer flex lg:justify-center"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const lastItem = items[items.length - 1];

                if (
                  !lastItem?.name ||
                  !lastItem?.quantity ||
                  !lastItem?.price
                ) {
                  alert("Fill up the current items");
                  return;
                }

                append({
                  name: "",
                  quantity: "",
                  price: "",
                });
              }}
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
