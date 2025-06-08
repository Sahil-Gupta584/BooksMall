import { createFileRoute } from "@tanstack/react-router";

import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import BookGallery from "../components/book/BookGallery";
import FilterSidebar from "../components/FilterSidebar";
import { axiosInstance } from "../lib/axiosInstance";

const filterSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  condition: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .optional(),
  categories: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => (typeof val === "string" ? [val] : val))
    .optional(),
  search: z.string().optional(), // ✅ include this if you're reading from it
});

export const Route = createFileRoute("/")({
  component: HomePage,
  validateSearch: filterSchema,
});
export type TFilter = z.infer<typeof filterSchema>;
function HomePage() {
  const { categories, condition, max, min, search } = Route.useSearch();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filter, setFilter] = useState<TFilter | null>({
    search: search,
    min: min,
    max: max,
    condition: condition,
    categories: categories,
  });

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["booksData"],
    queryFn: () =>
      axiosInstance
        .get("/api/books", {
          params: {
            min: filter ? filter.min : min,
            max: filter ? filter.max : max,
            condition: filter ? filter.condition : condition,
            categories: filter ? filter.categories : categories,
            search: filter ? filter.search : search,
          },
        })
        .then((res) => res.data),
  });

  // Simulate loading state
  useEffect(() => {
    if (error) {
      addToast({
        color: "danger",
        description: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (filter) {
      const newSearchParams = new URLSearchParams();

      if (filter.search) newSearchParams.set("search", filter.search);
      if (filter.min) newSearchParams.set("min", filter.min.toString());
      if (filter.max) newSearchParams.set("max", filter.max.toString());

      if (filter.condition)
        filter.condition.forEach((c) => newSearchParams.append("condition", c));
      if (filter.categories)
        filter.categories.forEach((g) =>
          newSearchParams.append("categories", g)
        );
      refetch();
      const newUrl =
        window.location.pathname +
        (newSearchParams.toString() ? `?${newSearchParams.toString()}` : "");

      window.history.replaceState(null, "", newUrl);
    }
  }, [filter, refetch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
      <div className="md:flex md:space-x-8">
        {/* Sidebar for filters */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar
              filter={filter}
              setFilter={setFilter}
              isMobileFilterOpen={isMobileFilterOpen}
              setIsMobileFilterOpen={setIsMobileFilterOpen}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ">
          <div className="flex justify-between items-center mb-6 ">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              {filter && filter.search
                ? `Results for "${filter.search}"`
                : "All Books"}
            </h1>
            <p className="text-sm text-gray-500">
              {isPending
                ? "Loading..."
                : filter &&
                    (filter.search ||
                      filter.min ||
                      filter.max ||
                      filter.condition ||
                      filter.categories)
                  ? `${data?.length ?? 0} books found`
                  : ""}
            </p>
          </div>

          <BookGallery books={data} isPending={isPending} />

          {/* Mobile filter dialog */}
          <div className="md:hidden">
            <FilterSidebar
              filter={filter}
              setFilter={setFilter}
              isMobileFilterOpen={isMobileFilterOpen}
              setIsMobileFilterOpen={setIsMobileFilterOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
