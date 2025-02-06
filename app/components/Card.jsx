import { getTimeElapsed } from "../resource";

export default function BookCard({ book, src }) {
  return (
    <div className="group relative m-4 w-full max-w-[320px] overflow-hidden rounded-xl border-2 border-orange-500 bg-white bg-opacity-20 p-1 backdrop-blur-lg backdrop-filter transition-all duration-300 hover:shadow-xl sm:w-[200px] md:w-[250px]">
      <a href={`/book/${book?.id}`} className="relative block overflow-hidden rounded-lg bg-white shadow-inner">
        <figure className="relative h-48 w-full overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={src || book?.bookImages[book?.coverImageIndex]}
            alt={book?.title || "Book cover"}
          />
          <div className="absolute inset-0 bg-black bg-opacity-10 transition-opacity duration-300 group-hover:bg-opacity-20"></div>
        </figure>
        <div className="p-4">
          <span className="mb-2 inline-block rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white shadow-md">
            ₹ {book?.price || '200'}
          </span>
          <h3 className="mb-2 truncate text-lg font-bold text-gray-800">
            {book?.title || 'Atomic Habits'}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center">
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {`${book?.state}, ${book?.city}` || 'Mumbai, Maharashtra'}
            </span>
            <span className="flex items-center">
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {getTimeElapsed(book?.timestamp)}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
