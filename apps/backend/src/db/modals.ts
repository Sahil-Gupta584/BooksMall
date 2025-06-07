import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // 🔒 Enforce uniqueness
    },
    image: {
      type: String,
      required: true,
    },
    chats: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "chats",
      default: [],
    },
    lastActive: Date,
  },
  { timestamps: true, collection: "user" }
);

const BooksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImageIndex: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      required: true,
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "messages",
    },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
      required: true,
    },
    status: {
      type: String,
      default: "sent",
    },
  },
  { timestamps: true }
);

const FeedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: [true, "title already exists."],
    },
    content: {
      type: String,
      required: true,
    },
    category: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    upVotedBy: {
      type: [mongoose.Schema.ObjectId],
      ref: "user",
    },
  },
  { timestamps: true }
);

const Chats = mongoose.models?.chats || mongoose.model("chats", ChatSchema);
const Messages =
  mongoose.models?.messages || mongoose.model("messages", MessageSchema);
const Users = mongoose.models?.user || mongoose.model("user", UserSchema);
const Books = mongoose.models?.books || mongoose.model("books", BooksSchema);
const Feedbacks =
  mongoose.models?.feedbacks || mongoose.model("feedbacks", FeedbackSchema);

export { Books, Chats, Feedbacks, Messages, Users };
