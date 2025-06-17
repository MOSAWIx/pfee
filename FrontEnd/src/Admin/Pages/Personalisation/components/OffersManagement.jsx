import React from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "react-hot-toast";

const OffersManagement = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      offers: [
        {
          id: 1,
          text: {
            en: "",
            ar: "",
            fr: "",
          },
          isActive: true,
        },
      ],
    },
  });

  const onSubmit = (data) => {
    console.log("Offers updated:", data);
    toast.success("Offers updated successfully");
  };

  const addNewOffer = () => {
    const currentOffers = watch("offers");
    setValue("offers", [
      ...currentOffers,
      {
        id: Date.now(),
        text: {
          en: "",
          ar: "",
          fr: "",
        },
        isActive: true,
      },
    ]);
  };

  const removeOffer = (index) => {
    const currentOffers = watch("offers");
    setValue(
      "offers",
      currentOffers.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Offers</h2>
        <button
          onClick={addNewOffer}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Offer
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {watch("offers").map((offer, index) => (
          <div
            key={offer.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-700/20 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Offer #{index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeOffer(index)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* English Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  English Text
                </label>
                <input
                  {...register(`offers.${index}.text.en`, {
                    required: "English text is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter offer text in English"
                />
                {errors.offers?.[index]?.text?.en && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.offers[index].text.en.message}
                  </p>
                )}
              </div>

              {/* Arabic Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Arabic Text
                </label>
                <input
                  {...register(`offers.${index}.text.ar`, {
                    required: "Arabic text is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter offer text in Arabic"
                  dir="rtl"
                />
                {errors.offers?.[index]?.text?.ar && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.offers[index].text.ar.message}
                  </p>
                )}
              </div>

              {/* French Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  French Text
                </label>
                <input
                  {...register(`offers.${index}.text.fr`, {
                    required: "French text is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter offer text in French"
                />
                {errors.offers?.[index]?.text?.fr && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.offers[index].text.fr.message}
                  </p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register(`offers.${index}.isActive`)}
                  className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-0"
                />
                <label className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  Active
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            Reset
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default OffersManagement;