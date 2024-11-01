'use server';
import { auth, signIn, signOut } from "@/auth";
import cloudinary from './cloudinary';
import { Books, Users, Chats, Messages } from "@/mongodb/models";
import { dbConnect } from "@/mongodb";

export async function handleMagicLink(formdata) {
  await signIn('nodemailer',formdata)
}

export async function handleGoogleAuth() {
  await signIn('google', { redirectTo: '/' });
}


export async function logOut() {
  await signOut({ redirectTo: '/auth' })
}

export async function verifyLogin() {
  try {
    return await auth();
  } catch (error) {
    console.log(error.message, error, 'from verifyLogin');
    return false;
  }
}

export async function getUser(userId) {
  try {
    const user = await Users.findById(userId)
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error, 'from getUser');
    throw error
  }
}

export async function uploadFile(file) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "Bookmall" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      }
    );
    return result.secure_url;
  } catch (error) {
    console.log(error.message, error, "from uploadFile");
  }
}

export async function saveToDb(formdata) {
  try {
    const bookData = JSON.parse(formdata.get('bookData'));
    const coverImageIndex = Number(formdata.get('coverImageIndex'));
    const location = JSON.parse(formdata.get('location'));
    const ownerId = formdata.get('ownerId');

    let urls = [];

    for (let [key, value] of formdata.entries()) {
      if (key.startsWith('images')) {
        const index = Number(key.match(/\[(\d+)\]/)[1]);
        if (value instanceof File) {
          const url = await uploadFile(value);
          urls[index] = url;
        } else if (typeof value === 'string') {
          urls[index] = value;
        }
      }
    }

    const bookDetails = {
      ...bookData,
      coverImageIndex,
      bookImages: urls,
      state: location.state,
      city: location.city,
      timestamp: Date.now().toString(),
      ownerId
    };

    await dbConnect();
    const newBook = await Books.create(bookDetails);

    return true;
  } catch (err) {
    console.log(err.message, err, "from saveToDb");
    return false;
  }
}

export async function updateBook(bookId, formdata) {
  try {
    const bookData = JSON.parse(formdata.get('bookData'));
    const coverImageIndex = Number(formdata.get('coverImageIndex'));
    let urls = [];

    for (let [key, value] of formdata.entries()) {
      if (key.startsWith('images')) {
        const index = Number(key.match(/\[(\d+)\]/)[1]);
        if (value instanceof File) {
          const url = await uploadFile(value);
          urls[index] = url;
        } else if (typeof value === 'string') {
          urls[index] = value;
        }
      }
    }

    const bookDetails = { ...bookData, coverImageIndex, bookImages: urls, timestamp: Date.now().toString() };

    await dbConnect();
    const updatedBook = await Books.findByIdAndUpdate(bookId, bookDetails, { new: true });

    return true;
  } catch (err) {
    console.log(err.message, err, "from updateBook");
    return false;
  }
}

export async function getBook(bookId) {
  try {
    console.log('getbook just for you!');
    
    await dbConnect();
    const book = await Books.findById(bookId);
    return JSON.parse(JSON.stringify(book));
  } catch (error) {
    console.log(error, 'from getBook');
    return error;
  }
}

export async function getUserBooks(userId) {
  try {
    await dbConnect();
    const books = await Books.find({ ownerId: userId });
    return JSON.parse(JSON.stringify(books));
  } catch (err) {
    console.log(err.message, err, "from getUserBooks");
    throw err;
  }
}

export async function deleteUserBook(bookId) {
  try {
    await dbConnect();
    await Books.findByIdAndDelete(bookId);
    console.log('Book deleted');
    return true;
  } catch (error) {
    console.log(error.message, error, 'from deleteUserBook');
    return false;
  }
}

// export async function getChatPartners(currentUserId) {
//   try {
//     await dbConnect();
//     const user = await Users.findById(currentUserId).populate('chatPartners');
//     const partners = user.chatPartners.map(async (partner) => await getUser(partner._id));
//     return Promise.all(partners);
//   } catch (error) {
//     console.log(error, 'from getChatPartners');
//   }
// }

export async function getChat(chatId, sellerId, currentUserId) {
  try {
    await dbConnect();
    const chat = await Chats.findById(chatId).populate('participants');
    console.log('chat', chat);

    if (!chat) {
      console.log('creating new chat!');
      
      let newChat = await Chats.create({_id:chatId , participants: [currentUserId, sellerId] });
      newChat = await newChat.populate('participants')
      console.log('newChat', newChat);

      return JSON.parse(JSON.stringify(newChat));
    }
    
    return JSON.parse(JSON.stringify(chat));
  } catch (error) {
    console.log(error, 'from getChat');
  }
}

export async function getCurrUser() {
  try {
    await dbConnect();
    const session = await auth();
console.log('session',session);

    if (session) {
      const user = await Users.findOne({ email: session.user.email }).populate({path:'chats', populate: {path:'participants'}})
      console.log('user:', user);
      const parsed = JSON.parse(JSON.stringify(user))
      return parsed;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error, 'from getCurrUser');
    throw error;
  }
}

export async function uploadMessage(message) {
  try {
    await dbConnect();
    await Messages.create(message);
  } catch (error) {
    console.log(error, 'from uploadMessage');
  }
}

export async function getPreviousMessages(chatId) {
  try {
    await dbConnect();
    const messages = await Messages.find({ chatId }).sort({ timestamp: 1 });
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.log(error, 'from getPreviousMessages');
    return [];
  }
}

export async function deleteDocument(messageId) {
  try {
    await dbConnect();
    await Messages.findByIdAndDelete(messageId);
  } catch (error) {
    console.log(error, 'from deleteDocument');
  }
}

export async function updateMessageSeen(chatId) {
  try {
    await dbConnect();
    const messages = await Messages.find({ chatId });
    messages.forEach(async (message) => {
      await Messages.findByIdAndUpdate(message._id, { status: 'seen' });
    });
  } catch (error) {
    console.log(error.message, error, 'from updateMessageSeen');
  }
}

export async function addChatToUser(currentUserId, chatId) {
  try {
    console.log('Adding new chat to user');
    
    await dbConnect();
    let user = await Users.findById(currentUserId);
    console.log('user.chats from addChat',user.chats);
    console.log('!user.chats.includes(chatId):',user.chats.includes(chatId));
    
    if (!user.chats.includes(chatId)) {
      user.chats.push([chatId]);
      await user.save();
      console.log('Added new chat to user');
    }
  } catch (error) {
    console.log(error, 'from addChatToUser');
    throw error;
  }
}

export async function getAllBooks() {
  try {
    await dbConnect();
    const books = await Books.find().sort({ timestamp: 1 });
    return JSON.parse(JSON.stringify(books));
  } catch (error) {
    console.log(error.message, error, 'from getAllBooks');
    return false;
  }
}
