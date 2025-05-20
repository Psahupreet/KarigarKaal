import { useState } from "react";
import axios from "axios";

export default function AddService() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    review: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value);
      }
    });

    try {
      await axios.post("http://82.29.165.206:8080/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Service added successfully!");
      setForm({
        name: "",
        description: "",
        price: "",
        rating: "",
        review: "",
        images: [],
      });
    } catch (err) {
      console.error("❌ Failed to add service:", err);
      alert("❌ Failed to add service. Please try again.");
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Add New Service
          </h1>
          <p className="mt-2 text-base sm:text-xl text-gray-500">
            Fill out the form to list your service
          </p>
        </div>

        <div className="bg-white shadow-md sm:shadow-xl rounded-lg sm:rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                {/* Service Name */}
                <div>
                  <label htmlFor="name" className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                    Service Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    placeholder="e.g., Professional AC Repair"
                    onChange={handleChange}
                    className="block w-full px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    placeholder="Detailed description of what your service includes..."
                    onChange={handleChange}
                    className="block w-full px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Price and Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="price" className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                      Price (₹)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={form.price}
                        placeholder="0.00"
                        onChange={handleChange}
                        className="block w-full pl-9 pr-4 py-2 sm:pl-10 sm:pr-5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rating" className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                      Rating
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        id="rating"
                        name="rating"
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={form.rating}
                        placeholder="4.5"
                        onChange={handleChange}
                        className="block w-full px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review */}
                <div>
                  <label htmlFor="review" className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                    Sample Review (Optional)
                  </label>
                  <input
                    id="review"
                    name="review"
                    value={form.review}
                    placeholder="e.g., 'Excellent service, highly recommend!'"
                    onChange={handleChange}
                    className="block w-full px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md sm:rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Images */}
                <div>
                  <label htmlFor="images" className="block text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                    Service Images
                  </label>
                  <div className="mt-1 flex justify-center px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6 border-2 border-gray-300 border-dashed rounded-lg sm:rounded-xl">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex flex-col sm:flex-row text-sm text-gray-600 justify-center items-center">
                        <label
                          htmlFor="images"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="images"
                            type="file"
                            name="images"
                            multiple
                            onChange={handleImageChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="mt-1 sm:mt-0 sm:pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  {form.images.length > 0 && (
                    <p className="mt-2 text-xs sm:text-sm text-green-600">
                      {form.images.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 sm:py-4 sm:px-6 border border-transparent rounded-lg sm:rounded-xl shadow-sm text-base sm:text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}