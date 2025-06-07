import { addToast, Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import React, { useState } from "react";
import { BiChevronLeft, BiChevronRight, BiMessageSquare } from "react-icons/bi";
import type { Book } from "../../routes/-types";

interface BookDetailsProps {
  book: Book;
  currentUserId: string | null;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, currentUserId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["handleChatWithSeller"],
    mutationFn: async () => {
      try {
        const res = await axios.post("/api/createChat", {
          userId: currentUserId,
          sellerId: book.owner._id,
        });
        if (res.data.ok) {
          navigate({
            to: "/chats/$sellerId",
            params: { sellerId: book.owner._id },
          });
          return;
        }
        addToast({ title: "Failed to create chat with seller" });
      } catch (error) {
        console.log(error);
        addToast({ title: "Failed to create chat with seller" });
        return error;
      }
    },
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === book.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? book.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  if (!book) return <p>No book data found</p>;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Book Image */}
        {/* Book Image Slider */}
        <div className="md:w-1/3 bg-gray-200 relative">
          <div className="relative h-full min-h-[400px] md:min-h-0">
            {/* Main Image */}
            <div className="relative h-full overflow-hidden">
              {book.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${book.title} - Image ${index + 1}`}
                  className={` absolute inset-0 h-full w-full object-cover transition-opacity duration-500
      ${index === currentImageIndex ? "opacity-100 " : "opacity-0 z-0"}
    `}
                  style={{ transition: "opacity 0.5s ease-in-out" }}
                />
              ))}

              {/* Navigation Arrows - Only show if more than 1 image */}
              {book.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <BiChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                    aria-label="Next image"
                  >
                    <BiChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {book.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {book.images.length}
                </div>
              )}
            </div>

            {/* Dots Indicator - Only show if more than 1 image */}
            {book.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {book.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white bg-opacity-50 hover:bg-opacity-75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Book Information */}
        <div className="md:w-2/3 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between mb-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {book.title}
              </h1>
              {/* <p className="text-lg text-gray-600 mb-2">by {book.author}</p> */}
              <div className="flex flex-wrap gap-2 mb-4">
                {book.categories.map((genre, index) => (
                  <span
                    key={index}
                    className="badge bg-secondary-100 text-secondary-800"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center bg-primary-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-bold text-primary-700">
                ₹{book.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Condition:{" "}
                <span className="font-semibold">{book.condition}</span>
              </p>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <h2 className="font-serif text-lg font-semibold mb-2">
              Description
            </h2>
            <p className="text-gray-600">{book.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* <div>
              <h2 className="font-serif text-lg font-semibold mb-2">
                Book Details
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-500">Publisher:</span>
                  <span className="font-medium">
                    {book.publisher || "Not specified"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Publication Year:</span>
                  <span className="font-medium">{book.publishYear}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Language:</span>
                  <span className="font-medium">{book.language}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Pages:</span>
                  <span className="font-medium">
                    {book.pageCount || "Not specified"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">ISBN:</span>
                  <span className="font-medium">
                    {book.isbn || "Not available"}
                  </span>
                </li>
              </ul>
            </div> */}

            {book.owner && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-serif text-lg font-semibold mb-2">
                  Seller Information
                </h2>
                <div className="flex items-center mb-3">
                  <img
                    src={book.owner.image}
                    alt={book.owner.name}
                    className="h-12 w-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">{book.owner.name}</p>
                    {/* <p className="text-sm text-gray-500">
                      <span className="text-yellow-500">★</span>{" "}
                      {book.owner.rating.toFixed(1)} · {book.owner.booksCount}{" "}
                      books
                    </p> */}
                    <p className="text-xs text-gray-500">
                      Member since{" "}
                      {new Date(book.owner.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {book.owner._id === currentUserId ? (
                  <Link
                    to={`/books/$bookId/edit`}
                    params={{ bookId: book._id }}
                  >
                    <button className="btn btn-secondary w-full flex items-center justify-center">
                      Edit
                    </button>
                  </Link>
                ) : (
                  <Button
                    isLoading={isPending}
                    onPress={() => mutate()}
                    color="secondary"
                    className="btn !btn-secondary w-full flex items-center justify-center"
                  >
                    {book.owner._id === currentUserId ? (
                      "Edit"
                    ) : (
                      <>
                        <BiMessageSquare className="h-5 w-5 mr-2" />
                        Chat with owner
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
