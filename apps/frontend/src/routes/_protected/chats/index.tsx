import { createFileRoute } from "@tanstack/react-router";
import { ChatSection } from "../../../components/chat";

export const Route = createFileRoute("/_protected/chats/")({
  component: Index,
});
export default function Index() {
  return <ChatSection sellerId="" />;
}
