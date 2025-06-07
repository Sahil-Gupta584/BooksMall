import { createFileRoute } from "@tanstack/react-router";
import { BookCommonForm } from "../../../components/book/bookCommonForm";
export const Route = createFileRoute("/_protected/sell/")({
  component: () => <BookCommonForm />,
});
