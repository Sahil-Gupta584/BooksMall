import { Book } from "@/-types";
import addPhoto from "@/pubic/addphoto.png";
import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSession } from "../../lib/auth-client";
import { axiosInstance } from "../../lib/axiosInstance";
import { categories, conditions, states } from "../../lib/data";

type TPrevData = {
  images: string[];
  coverImageIndex: number;
  bookData: Book;
};
type TImages = { file?: File; url: string };
export function BookCommonForm({ prevData }: { prevData?: TPrevData }) {
  const [images, setImages] = useState<TImages[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["getIndianCities"],
    queryFn: async () =>
      axios(
        "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/cities.json"
      ).then((res) =>
        res.data.filter(
          (c: { country_name: string }) => c.country_name === "India"
        )
      ),
  });

  const [bookData, setBookData] = useState<Partial<Book>>({
    title: "",
    price: 0,
    condition: "Good",
    categories: [],
    description: "",
  });
  useEffect(() => {
    if (!prevData) return;
    if (prevData && prevData.images)
      setImages(prevData?.images.map((i) => ({ url: i })));
    setCoverImageIndex(prevData.coverImageIndex);
    setBookData({ ...prevData });
  }, [prevData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log({ value, name });

    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log({ value, checked });

    setBookData((prev) => ({
      ...prev,
      categories: checked
        ? [...(prev.categories || []), value]
        : (prev.categories || []).filter((g) => g !== value),
    }));
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) =>
      Array.isArray(prevImages)
        ? (prevImages.filter((_, i) => i !== index) as typeof prevImages)
        : prevImages
    );
    if (coverImageIndex === index) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > index) {
      setCoverImageIndex(coverImageIndex - 1);
    }
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const { mutateAsync, isPending: isSubmitting } = useMutation({
    mutationKey: ["submitListing"],
    mutationFn: async () => {
      const imageUrls: string[] = [];

      await Promise.all(
        images.map(async (i) => {
          const form = new FormData();
          if (!i.file) {
            imageUrls.push(i.url);
            return;
          }
          form.append("image", new Blob([i.file], { type: i.file.type }));
          const res = await axiosInstance.post("/api/fileToUrl", form);

          if (res.data.ok) {
            imageUrls.push(res.data.url);
          }
        })
      );

      const bookRes = await axiosInstance.post(
        `/api/books/${prevData ? "update" : "create"}`,
        {
          bookData: {
            ...bookData,
            images: imageUrls,
            coverImageIndex,
            owner: session?.user.id,
          },
        }
      );
      return bookRes.data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      if (images.length === 0) {
        addToast({
          title: "At least 1 image is required.",
          color: "danger",
        });
        return;
      }
      e.preventDefault();
      const data = await mutateAsync();
      if (data.ok) {
        addToast({ title: "Book Updated Successfully!", color: "success" });
        navigate({ to: "/" });
      }
      if (!data.ok) {
        addToast({
          title: "Error",
          description: "Oops, Something wen wrong!",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Oops, Something wen wrong!",
        color: "danger",
      });
      console.log(error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const remainingSlots = 5 - images.length;
    const filesToAdd = files.slice(0, remainingSlots).map((f) => {
      const url = URL.createObjectURL(f);
      return { url, file: f };
    });
    setImages((prevImages) => [...prevImages, ...filesToAdd]);
  };

  const BackBtn = () => (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => setStep((prev) => prev - 1)}
    >
      Back
    </button>
  );
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate({ to: "/" })}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <FaArrowLeft className="h-5 w-5 mr-1" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
          <h1 className="text-2xl font-serif font-bold text-primary-800">
            Sell Your Book
          </h1>
          <p className="text-sm text-gray-600">
            List your book for sale and connect with potential buyers
          </p>
        </div>

        <div className="p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`h-1 w-12 ${
                    step >= 2 ? "bg-primary-500" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div
                  className={`h-1 w-12 ${
                    step >= 3 ? "bg-primary-500" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-gray-500">Step {step} of 3</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  Book Information
                </h2>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Book Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={bookData.title}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter the full title of the book"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 w-full justify-between">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price (₹)*
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        required
                        min="0.01"
                        step="0.01"
                        value={bookData.price}
                        onChange={handleNumberInput}
                        className="input pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="condition"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Condition*
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      required
                      value={bookData.condition}
                      onChange={handleInputChange}
                      className="input"
                    >
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    categories (select at least one)*
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-y-2 gap-x-4 max-h-48 overflow-y-auto">
                    {categories.map((genre) => (
                      <div
                        key={genre}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          id={`genre-${genre}`}
                          name="genre"
                          type="checkbox"
                          value={genre}
                          checked={(bookData.categories || []).includes(genre)}
                          onChange={handleGenreChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`genre-${genre}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {genre}
                        </label>
                      </div>
                    ))}
                  </div>
                  {bookData.categories?.length === 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      Please select at least one genre
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={bookData.description}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Describe the book's content and condition"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                    disabled={(bookData.categories || []).length === 0}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  Listing Details
                </h2>
                <p className="text-sm font-medium text-gray-900 mb-4">
                  Select a place where you can hands on your book to a buyer
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State*
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={bookData.state}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City*
                    </label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={bookData.city}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!bookData.state || isPending}
                    >
                      <option value="">Select City</option>
                      {data
                        .filter(
                          (c: { state_name: string; name: string }) =>
                            c.state_name === bookData.state
                        )
                        .map((city: { state_name: string; name: string }) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                {/* <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Author*
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    required
                    value={bookData.author}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter the author's name"
                  />
                </div> */}

                <div className="flex justify-between">
                  <BackBtn />

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Photo & Review */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  Upload Photo & Review
                </h2>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    UPLOAD UP TO 5 PHOTOS
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {images.length > 0 &&
                      images.map((image, index) => {
                        return (
                          <div
                            key={index}
                            className="relative w-[125px] h-[125px]"
                          >
                            <img
                              src={image.url}
                              alt={`Preview ${index + 1}`}
                              className={`w-full h-32 object-cover rounded ${index === coverImageIndex ? "ring-4 ring-primary-900" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-0 right-0 bg-primary-500 text-white rounded-full p-1 m-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCoverImageIndex(index)}
                              className="absolute bottom-1 left-0 bg-primary-500 text-white text-xs px-2 py-1 m-1 rounded"
                            >
                              {index === coverImageIndex
                                ? "Cover"
                                : "Set as cover"}
                            </button>
                          </div>
                        );
                      })}
                    {images.length < 5 && (
                      <div className="w-[125px] h-[125px]">
                        <label
                          htmlFor="addimg"
                          className="h-full  border-2 border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-100 p-5"
                        >
                          <img
                            src={addPhoto.src}
                            alt="add photo"
                            className="w-8 h-8 object-cover rounded-lg"
                          />
                          <span className="text-bold mx-[-2px] pb-[30px]">
                            +
                          </span>
                        </label>
                        <input
                          id="addimg"
                          name="addimg"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          multiple
                          onChange={(e) => handleImageUpload(e)}
                          min="1"
                          max="5"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-3">
                    Review Your Listing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Title</p>
                      <p className="font-medium">{bookData.title}</p>
                    </div>
                    {/* <div>
                      <p className="text-sm text-gray-500">Author</p>
                      <p className="font-medium">{bookData.author}</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">
                        {bookData.price?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">{bookData.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Genre</p>
                      <p className="font-medium">
                        {bookData.categories?.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm">{bookData.description}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <BackBtn />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? prevData
                        ? "Updating..."
                        : "Submitting..."
                      : prevData
                        ? "Update book"
                        : "List Book for Sale"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
