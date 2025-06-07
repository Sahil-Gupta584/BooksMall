import { createFileRoute } from "@tanstack/react-router";
import { ChatSection } from "../../../../components/chat";

export const Route = createFileRoute("/_protected/chats/$sellerId/")({
  component: ChatPage,
});

export default function ChatPage() {
  const { sellerId } = Route.useParams();

  return <ChatSection sellerId={sellerId} />;
}
