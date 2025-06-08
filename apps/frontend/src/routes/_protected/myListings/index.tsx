import { addToast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BsTrash2 } from "react-icons/bs";
import { FaPencil } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import { useSession } from "../../../lib/auth";
import { axiosInstance } from "../../../lib/axiosInstance";

export const Route = createFileRoute("/_protected/myListings/")({
  component: MyListingsPage,
});

function MyListingsPage() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const { data } = useSession();

  const {
    isPending,
    data: userBooks,
    refetch,
  } = useQuery({
    queryKey: ["getMyListings"],
    queryFn: async () => {
      const books = await axiosInstance.post("/api/books/myBooks", {
        userId: data?.user.id,
      });
      return books.data;
    },

    enabled: !!data?.user.id,
  });
  const handleEdit = (bookId: string) => {
    navigate({ to: "/books/$bookId/edit", params: { bookId } });
  };
  const { mutateAsync } = useMutation({
    mutationKey: ["deleteBook"],
    mutationFn: async ({ bookId }: { bookId: string }) =>
      axiosInstance
        .post("/api/books/delete", { bookId })
        .then((res) => res.data),
    onSuccess: () => {
      addToast({ title: "Book Deleted Successfully!", color: "success" });
      refetch();
    },
  });
  const handleDelete = async (bookId: string) => {
    setIsDeleting(bookId);
    await mutateAsync({ bookId });
    setIsDeleting(null);
    setShowDeleteConfirm(null);
  };

  if (userBooks && userBooks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            My Listings
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <FiAlertCircle className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                No books listed yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start selling your books by creating your first listing
              </p>
              <button
                onClick={() => navigate({ to: "/sell" })}
                className="btn btn-primary"
              >
                List a Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isPending || !userBooks) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          My Listings
        </h1>
        <button
          onClick={() => navigate({ to: "/sell" })}
          className="btn btn-primary"
        >
          List New Book
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userBooks &&
          Array.isArray(userBooks) &&
          userBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="relative h-48">
                <img
                  src={book.images[book.coverImageIndex]}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="badge bg-white text-gray-800">
                    {book.condition}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-serif font-bold text-lg mb-1 line-clamp-1">
                  {book.title}
                </h3>
                {/* <p className="text-gray-600 text-sm mb-2">{book.author}</p> */}
                <p className="font-bold text-primary-700 mb-4">
                  ₹{book.price.toFixed(2)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(book._id)}
                      className="btn btn-ghost p-2"
                      title="Edit listing"
                    >
                      <FaPencil className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(book._id)}
                      className="btn btn-ghost p-2"
                      title="Delete listing"
                    >
                      <BsTrash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {book.city}, {book.state}
                  </div>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm === book._id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Delete Listing
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to delete "{book.title}"? This
                      action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="btn bg-red-500 text-white hover:bg-red-600"
                        disabled={isDeleting === book._id}
                      >
                        {isDeleting === book._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-pulse">
    <div className="relative h-48 bg-gray-200" />
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="h-9 w-9 bg-gray-200 rounded" />
          <div className="h-9 w-9 bg-gray-200 rounded" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);
