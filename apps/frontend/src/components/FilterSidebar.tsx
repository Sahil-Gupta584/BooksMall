import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { LuSlidersHorizontal } from "react-icons/lu";
import { z } from "zod";
import { categories, conditions } from "../lib/data";
import type { TFilter } from "../routes";

interface FilterSidebarProps {
  filter: TFilter | null;
  setFilter: (filter: TFilter) => void;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (isOpen: boolean) => void;
}
const priceSchema = z.object({
  min: z.number(),
  max: z.number(),
});

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filter,
  setFilter,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
}) => {
  const [showcategories, setShowcategories] = useState(true);
  const [showConditions, setShowConditions] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  const { handleSubmit, register, reset } = useForm<
    z.infer<typeof priceSchema>
  >({
    defaultValues: { max: filter?.max, min: filter?.min },
  });
  const handleGenreChange = (category: string) => {
    const newcategories =
      filter && filter.categories && filter.categories.includes(category)
        ? filter.categories.filter((g) => g !== category)
        : [...(filter?.categories ?? []), category];

    setFilter({
      ...filter,
      categories: newcategories,
      condition: filter?.condition ?? [],
    });
  };

  const handleConditionChange = (condition: string) => {
    const newConditions =
      filter && filter.condition && filter.condition.includes(condition)
        ? filter.condition.filter((c) => c !== condition)
        : [...(filter?.condition ?? []), condition];

    setFilter({
      ...filter,
      condition: newConditions,
    });
  };

  const clearAllFilters = () => {
    setFilter({});
    reset();
  };

  interface FilterSectionProps {
    title: string;
    isOpen: boolean;
    toggleOpen: () => void;
    children: React.ReactNode;
  }

  const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    isOpen,
    toggleOpen,
    children,
  }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between text-left font-medium text-gray-900"
      >
        <span>{title}</span>
        <FaChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          type="button"
          className="text-sm text-primary-600 hover:text-primary-700"
          onClick={clearAllFilters}
        >
          Clear all
        </button>
        <button
          type="button"
          className="md:hidden rounded-md text-gray-500 hover:text-gray-600"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <FaX className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <FilterSection
          title="Price"
          isOpen={showPrice}
          toggleOpen={() => setShowPrice(!showPrice)}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <label
                  htmlFor="min-price"
                  className="block text-sm text-gray-600"
                >
                  Min
                </label>
                <div className="relative mt-1 rounded-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    className="input pl-8"
                    placeholder="0"
                    {...register("min", { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="max-price"
                  className="block text-sm text-gray-600"
                >
                  Max
                </label>
                <div className="relative mt-1 rounded-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    id="max-price"
                    min="0"
                    className="input pl-8"
                    placeholder="Any"
                    {...register("max", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit((formData) => {
                setFilter({
                  ...filter,
                  min: formData.min,
                  max: formData.max,
                });
              })}
              className="self-start mt-1 rounded bg-primary-600 px-3 py-1 text-sm text-white hover:bg-primary-700"
            >
              Apply
            </button>
          </div>
        </FilterSection>

        <FilterSection
          title="Book Condition"
          isOpen={showConditions}
          toggleOpen={() => setShowConditions(!showConditions)}
        >
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center cursor-pointer">
                <input
                  id={`condition-${condition}`}
                  name="condition"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={
                    filter && filter.condition
                      ? filter.condition.includes(condition)
                      : false
                  }
                  onChange={() => handleConditionChange(condition)}
                />
                <label
                  htmlFor={`condition-${condition}`}
                  className="ml-3 text-sm text-gray-700 cursor-pointer"
                >
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Genre"
          isOpen={showcategories}
          toggleOpen={() => setShowcategories(!showcategories)}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center cursor-pointer">
                <input
                  id={`category-${category}`}
                  name="category"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={
                    filter && filter.categories
                      ? filter.categories.includes(category)
                      : false
                  }
                  onChange={() => handleGenreChange(category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-3 text-sm text-gray-700 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile filter dialog */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${isMobileFilterOpen ? "visible" : "invisible"}`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={() => setIsMobileFilterOpen(false)}
        ></div>
        <div
          className={`relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition-transform duration-300 ${
            isMobileFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="px-4">{sidebarContent}</div>
        </div>
      </div>

      {/* Desktop filter sidebar */}
      <div className="hidden md:block">{sidebarContent}</div>

      {/* Mobile filter toggle */}
      <div className="flex md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
        <button
          type="button"
          className="flex items-center px-4 py-2 rounded-full bg-primary-500 text-white shadow-lg"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <LuSlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>
    </>
  );
};

export default FilterSidebar;
