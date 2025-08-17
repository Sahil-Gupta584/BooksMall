export interface Book {
  _id: string;
  title: string;
  categories: string[];
  price: number;
  coverImageIndex: number;
  condition: "New" | "Like New" | "Very Good" | "Good" | "Fair" | "Poor";
  images: string[];
  description: string;
  state: string;
  city: string;
  owner: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  status?: "online" | "offline" | "typing";
  lastActive: Date;
  createdAt: Date;
}

export interface Chat {
  _id: string;
  participants: [User, User]; // [currentUser, otherUser]
  lastMessage?: Message;
  updatedAt: Date;
  unreadCount: number;
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  chatId: string;
  createdAt: Date;
  updatedAt: Date;
  status: "sent" | "seen";
}

export interface Feedback {
  _id: string;
  user: User;
  title: string;
  content: string;
  category: string;
  upVotedBy: User[];
  createdAt: Date;
  updatedAt: Date;
}
