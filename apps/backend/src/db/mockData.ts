// Mock Users
export const users = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    name: "Robert Smith",
    email: "robert.smith@example.com",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@example.com",
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
  },
  {
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
  },
  {
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
];

// Current logged-in user (for demo purposes)
export const currentUser = {
  name: "You",
  email: "",
  image: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg",
};

// Mock Books
export const books = [
  {
    title: "To Kill a Mockingbird",
    price: 12.99,
    images: [
      "https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg",
    ],
    coverImageIndex: 0,
    condition: "Very Good",
    categories: ["Classic", "Fiction"],
    description:
      "A powerful story of a lawyer in the Deep South defending a black man charged with the rape of a white girl. Through the young eyes of Scout and Jem Finch, Harper Lee explores the irrationality of adult attitudes to race and class in the Deep South of the thirties.",
    state: "Maharashtra",
    city: "Pune",
    ownerId: "683c0b1922889ba0c01fa4ef",
  },
  {
    title: "1984",
    price: 9.99,
    images: [
      "https://images.pexels.com/photos/2099266/pexels-photo-2099266.jpeg",
    ],
    coverImageIndex: 0,
    condition: "Good",
    categories: ["Dystopian", "Classic"],
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian, bureaucratic world.",
    state: "Tamil Nadu",
    city: "Chennai",
    ownerId: "683c0b1922889ba0c01fa4ee",
  },
  {
    title: "The Great Gatsby",
    price: 14.5,
    images: [
      "https://images.pexels.com/photos/4466381/pexels-photo-4466381.jpeg",
    ],
    coverImageIndex: 0,
    condition: "Like New",
    categories: ["Classic", "Fiction"],
    description:
      "The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story is of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan.",
    state: "Karnataka",
    city: "Bangalore",
    ownerId: "683c0b1922889ba0c01fa4ee",
  },
  {
    title: "The Hobbit",
    price: 18.99,
    images: [
      "https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg",
    ],
    coverImageIndex: 0,
    condition: "Good",
    categories: ["Fantasy", "Adventure"],
    description:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
    state: "Delhi",
    city: "New Delhi",
    ownerId: "683c0b1922889ba0c01fa4ee",
  },
  {
    title: "Pride and Prejudice",
    price: 11.25,
    images: [
      "https://images.pexels.com/photos/1906793/pexels-photo-1906793.jpeg",
    ],
    coverImageIndex: 0,
    condition: "Fair",
    categories: ["Romance", "Classic"],
    description:
      'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print."',
    state: "West Bengal",
    city: "Kolkata",
    ownerId: "683c0b1922889ba0c01fa4f0",
  },
  {
    title: "Dune",
    price: 22.99,
    images: [
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    ],
    coverImageIndex: 0,
    condition: "New",
    categories: ["Science Fiction", "Fantasy"],
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    state: "Gujarat",
    city: "Ahmedabad",
    ownerId: "683c0b1922889ba0c01fa4ef",
  },
  {
    title: "The Alchemist",
    price: 15.75,
    images: [
      "https://images.pexels.com/photos/3646105/pexels-photo-3646105.jpeg",
    ],
    coverImageIndex: 0,
    condition: "Very Good",
    categories: ["Fiction", "Fantasy", "Philosophical"],
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.",
    state: "Punjab",
    city: "Ludhiana",
    ownerId: "683c0b1922889ba0c01fa4ef",
  },
  {
    title: "Brave New World",
    price: 13.5,
    images: [
      "https://images.pexels.com/photos/3747497/pexels-photo-3747497.jpeg",
    ],
    coverImageIndex: 0,
    condition: "Good",
    categories: ["Dystopian", "Science Fiction"],
    description:
      "Aldous Huxley’s chilling vision of a future where happiness is mandated and individuality erased. A foundational dystopian classic.",
    state: "Rajasthan",
    city: "Jaipur",
    ownerId: "683c0b1922889ba0c01fa4ef",
  },
];

// Mock Messages
export const messages: Message[] = [
  {
    content:
      "Hi there! I saw you're interested in my copy of To Kill a Mockingbird. Let me know if you have any questions!",
    timestamp: "2023-07-10T14:30:00Z",
    read: true,
  },
  {
    content:
      "Yes, I am! Could you tell me more about its condition? Are there any highlights or notes in the book?",
    timestamp: "2023-07-10T14:35:00Z",
    read: true,
  },
  {
    content:
      "The book is in very good condition. No highlights or notes. The spine is intact with minimal creasing. Pages are clean with no tears. Would you like to see more photos?",
    timestamp: "2023-07-10T14:40:00Z",
    read: true,
  },
  {
    content:
      "That sounds great! Yes, I'd love to see more photos, especially of the spine and any wear on the corners.",
    timestamp: "2023-07-10T14:45:00Z",
    read: true,
  },
  {
    content:
      "I'll send some photos this evening when I get home. Are you interested in any other classics? I have a few more I might be selling soon.",
    timestamp: "2023-07-10T14:50:00Z",
    read: false,
  },
  {
    content:
      "Hello! I noticed you've been looking at The Great Gatsby. It's a first edition reprint with a beautiful cover.",
    timestamp: "2023-07-09T11:20:00Z",
    read: true,
  },
  {
    content: "Hi Emily! Yes, I'm very interested. Is the price negotiable?",
    timestamp: "2023-07-09T11:25:00Z",
    read: true,
  },
  {
    content: "I could come down to $12.50. Would that work for you?",
    timestamp: "2023-07-09T11:30:00Z",
    read: true,
  },
];

// Mock Chats
export const chats: Chat[] = [
  {
    participants: ["6", "1"], // [currentUser, seller]
    lastMessage: messages[4],
    unreadCount: 1,
  },
  {
    participants: ["6", "3"], // [currentUser, seller]
    lastMessage: messages[7],
    unreadCount: 0,
  },
];
