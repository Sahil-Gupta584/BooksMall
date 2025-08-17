import { addToast, Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { BiMessageSquare } from "react-icons/bi";
import { axiosInstance } from "../../lib/axiosInstance";
import { Book } from "@/-types";
import { ImageSlider } from "../imageSlider";

interface BookDetailsProps {
  book: Book;
  currentUserId: string | null;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, currentUserId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["handleChatWithSeller"],
    mutationFn: async () => {
      try {
        if (!currentUserId) navigate({ to: "/login" });
        const res = await axiosInstance.post("/api/chats/createChat", {
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

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = "unset";
  };
  if (!book) return <p>No book data found</p>;

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book Image */}
          {/* Book Image Slider */}
          <div>
            <ImageSlider
              images={book.images}
              currentIndex={currentImageIndex}
              setCurrentIndex={setCurrentImageIndex}
              setIsFullscreen={setIsFullscreen}
            />
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
      {isFullscreen && (
        <ImageSlider
          images={book.images}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
          fullscreen
          onClose={closeFullscreen}
          setIsFullscreen={setIsFullscreen}
        />
      )}
    </>
  );
};

export default BookDetails;
