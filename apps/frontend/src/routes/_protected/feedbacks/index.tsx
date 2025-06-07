import { addToast, Button } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { BiChevronUp, BiMessageSquare } from "react-icons/bi";
import { FaBug, FaLightbulb } from "react-icons/fa";
import { FiAlertCircle, FiSend, FiSettings } from "react-icons/fi";

import { createFileRoute } from "@tanstack/react-router";
import type { Feedback } from "../../-types";
import { feedbackCategories } from "../../../data/mockData";
import { useSession } from "../../../lib/auth";
import { formatDistanceToNow } from "../../../utils/dateUtils";
export const Route = createFileRoute("/_protected/feedbacks/")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const { data } = useSession();
  const {
    isPending: isLoading,
    data: allFeedbacks,
    refetch,
  } = useQuery({
    queryKey: ["getFeedbacks"],
    queryFn: async () => {
      return (await axios.get("/api/feedbacks/read")).data as Feedback[];
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Partial<Feedback>>();

  async function onSubmit(formData: Partial<Feedback>) {
    try {
      const feedback = {
        id: `f${Date.now()}`,
        user: data?.user.id,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        upvotedBy: [data?.user.id],
      };
      const res = await axios.post("/api/feedbacks/create", { feedback });
      console.log(res.data);

      if (res.data.ok) {
        addToast({
          title: "Feedback Submitted Successfully.",
          color: "success",
        });
        refetch();
        return;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      let message: string | undefined;
      const data = axiosError?.response?.data;
      if (data && typeof data === "object" && "message" in data) {
        message = (data as { message?: string }).message;
      }
      message = message || axiosError?.message || "Unknown error";

      addToast({
        title: "Failed to submit feedback",
        description: message,
        color: "danger",
      });
    }
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ["toggleVote"],
    mutationFn: async ({ feedbackId }: { feedbackId: string }) => {
      const path = allFeedbacks
        ?.find((f) => f._id === feedbackId)
        ?.upVotedBy.map((u) => u._id)
        .includes(data?.user.id as string)
        ? "devote"
        : "upvote";
      return await axios.post(`/api/feedbacks/${path}`, {
        userId: data?.user.id,
        feedbackId,
      });
    },
    onSuccess: () => refetch(),
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bug":
        return <FaBug className="h-4 w-4" />;
      case "feature":
        return <FaLightbulb className="h-4 w-4" />;
      case "improvement":
        return <FiSettings className="h-4 w-4" />;
      default:
        return <BiMessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryObj = feedbackCategories.find((c) => c.value === category);
    return categoryObj?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Feedback & Suggestions
        </h1>
        <p className="text-gray-600">
          Help us improve BooksMall by sharing your feedback, reporting bugs, or
          suggesting new features.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
              Submit Feedback
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title*
                </label>
                <input
                  className="input"
                  placeholder="Brief description of your feedback"
                  {...register("title")}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category*
                </label>
                <select className="input" {...register("category")}>
                  {feedbackCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description*
                </label>
                <textarea
                  rows={4}
                  className="input"
                  placeholder="Provide detailed information about your feedback..."
                  {...register("content")}
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <FiSend className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Feedback List */}
        <div className="lg:col-span-2">
          {/* Feedback List */}
          <div className="space-y-4">
            {isLoading && <LoadingSkeleton />}
            {allFeedbacks && allFeedbacks.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <FiAlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No feedback found
                </h3>
                <p className="text-gray-500">
                  No feedbacks yet, get started by adding first feedback!
                </p>
              </div>
            )}

            {allFeedbacks &&
              allFeedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {feedback.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`badge ${getCategoryColor(feedback.category)} flex items-center`}
                        >
                          {getCategoryIcon(feedback.category)}
                          <span className="ml-1">
                            {
                              feedbackCategories.find(
                                (c) => c.value === feedback.category
                              )?.label
                            }
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Upvote Button */}
                    <Button
                      isLoading={isPending}
                      isIconOnly
                      onPress={() => mutate({ feedbackId: feedback._id })}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 h-fit ${
                        feedback.upVotedBy
                          .map((u) => u._id)
                          .includes(data?.user.id as string)
                          ? "bg-primary-400 text-white hover:bg-primary-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <BiChevronUp
                        className={`h-5 w-5 ${
                          feedback.upVotedBy
                            .map((u) => u._id)
                            .includes(data?.user.id as string)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {feedback.upVotedBy.length}
                      </span>
                    </Button>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feedback.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <img
                          src={feedback.user.image}
                          alt={feedback.user.name}
                          className="h-6 w-6 rounded-full object-cover mr-2"
                        />
                        <span>{feedback.user.name}</span>
                      </div>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(feedback.createdAt))}
                      </span>
                    </div>

                    {feedback.updatedAt !== feedback.createdAt && (
                      <span className="text-xs">
                        Updated{" "}
                        {formatDistanceToNow(new Date(feedback.updatedAt))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);
