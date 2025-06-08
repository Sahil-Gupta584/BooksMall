import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { BookCommonForm } from "../../../../components/book/bookCommonForm";

export const Route = createFileRoute("/books/$bookId/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { bookId } = Route.useParams();

  const { isPending, data } = useQuery({
    queryKey: ["bookDetails"],
    queryFn: () => axios(`/api/books/${bookId}`).then((res) => res.data),
  });
  return (
    <>
      {isPending && <SkeletonLoader />}
      {data && <BookCommonForm prevData={data} />}
    </>
  );
}

const SkeletonLoader = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    {/* Back button skeleton */}
    <div className="flex items-center mb-6">
      <div className="h-5 w-5 bg-gray-200 rounded mr-1"></div>
      <div className="h-5 w-12 bg-gray-200 rounded"></div>
    </div>

    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-gray-100 px-6 py-4 border-b">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      <div className="p-6">
        {/* Progress indicator skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-1 w-12 bg-gray-200 mx-2"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-1 w-12 bg-gray-200 mx-2"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Form skeleton */}
        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>

          {/* Input fields skeleton */}
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-10 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>

          {/* Button skeleton */}
          <div className="flex justify-end">
            <div className="h-10 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
