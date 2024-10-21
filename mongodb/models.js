import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
})

const BooksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: String,
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
    bookImages: {
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
    timestamp: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
})

const ChatSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        required: true,
    }
})

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chats',
        required: true,
    },
    status: {
        type: String,
        default: "sent",
    },
    timestamp: {
        type: String,
        required: true,
    },
})

const Chats = mongoose.models?.chats || mongoose.model('chats', ChatSchema)
const Messages = mongoose.models?.messages || mongoose.model('messages', MessageSchema)
const Users = mongoose.models?.users || mongoose.model('users', UserSchema)
const Books = mongoose.models?.books || mongoose.model('books', BooksSchema)

export { Chats, Messages, Users, Books };

