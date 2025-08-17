import { Book } from "@/-types";
import React from "react";
import BookCard from "./BookCard";

interface BookGalleryProps {
  books: Book[];
  isPending?: boolean;
}

const BookGallery: React.FC<BookGalleryProps> = ({ books, isPending }) => {
  if (isPending || !books) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 h-64 rounded-t-md"></div>
            <div className="bg-white p-4 rounded-b-md">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-2 mb-4">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(books) && books.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No books found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or search criteria to find what you&apos;re
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.isArray(books) &&
        books.map((book) => <BookCard key={book._id} book={book} />)}
    </div>
  );
};

export default BookGallery;
