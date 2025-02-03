'use server';
import { auth, signIn, signOut } from "@/auth";
import cloudinary from './cloudinary';
import { Books, Users, Chats, Messages, Feedbacks } from "@/mongodb/models";
import { dbConnect } from "@/mongodb";
import { pgClient } from "@/lib/db";

export async function handleMagicLink(formdata) {
  await signIn('nodemailer', formdata)
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

export async function submitFeedback(data) {
  try {
    await dbConnect();

    const res = await Feedbacks.create({
      title: data.title,
      description: data.description,
    });
    return JSON.parse(JSON.stringify(res))
  } catch (error) {
    console.log(error, 'err from submitFeedback');
    throw error
  }
}

export async function toggleUpvote(feedbackId, email) {
  try {
    await dbConnect()

    let feedback = await Feedbacks.findById(feedbackId);

    console.log('feedback', feedback);

    if (feedback.upVotedBy.includes(email)) {
      feedback.upVotedBy = feedback.upVotedBy.filter(e => e !== email);
    } else {
      feedback.upVotedBy.push(email);
    }
    await feedback.save();
  } catch (error) {
    console.log(error, 'err from submitFeedback');
    throw error
  }
}

export async function getFeedbacks() {
  try {

    const res = await Feedbacks.find()
    return JSON.parse(JSON.stringify(res));
  } catch (error) {
    console.log(error, 'err in getFeedbacks');

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

    const values = [
      bookDetails.title,
      bookDetails.category,
      bookDetails.price,
      bookDetails.condition,
      bookDetails.description,
      bookDetails.coverImageIndex,
      bookDetails.bookImages, // Store array as JSON string
      bookDetails.state,
      bookDetails.city,
      Math.floor(Date.now() / 1000),
      3,
    ];

    await dbConnect();
    await pgClient.connect()
    const createBookQuery = 'insert into books (title,category,price,condition,description,coverImageIndex,bookImages,state,city,timestamp,ownerId) values($1,$2,$3,$4,$5,$6,$7,$8,$9, TO_TIMESTAMP($10), $11) '
    const res = await pgClient.query(createBookQuery, values)
    console.log('res', res)
    const newBook = await Books.create(bookDetails);

    return true;
  } catch (err) {
    console.log(err.message, err, "from saveToDb");
    return false;
  }
}

export async function updateBook(bookId, formdata) {
  try {
    console.log('running')

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
console.log('updating')
const bookDetails = { ownerId:3,...bookData, coverImageIndex, bookImages: urls, timestamp: Math.floor(Date.now() / 1000) };
delete bookDetails._id  
delete bookDetails.__v
    const values = [
      '3',
      'aaaaaaaaaaaa',
      'fiction',
      '1',
      'new',
      '11111111111111111111',
      0,
      [],
      'Assam',
      'Badarpur',
      '1738597783131'
    ]
    console.log('bookDetails',bookDetails)
    console.log('values',values)
    await dbConnect();
    await pgClient.connect()
    const updateQuery = `update books set ${Object.keys(bookDetails).map((key, i) => key==='timestamp'?`${key}=TO_TIMESTAMP($${i+1})`:`${key}=$${i + 1}`)} where id=1`
    console.log('updateQuery',updateQuery)
    const res = await pgClient.query(updateQuery, values)

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
    await pgClient.connect()
    await pgClient.query('delete from books where id=1')
    await dbConnect();
    await Books.findByIdAndDelete(bookId);
    console.log('Book deleted');
    return true;
  } catch (error) {
    console.log(error.message, error, 'from deleteUserBook');
    return false;
  }
}

export async function getChat(chatId, sellerId, currentUserId) {
  try {
    await dbConnect();
    const chat = await Chats.findById(chatId).populate('participants');
    console.log('chat', chat);

    if (!chat) {
      console.log('creating new chat!');

      let newChat = await Chats.create({ _id: chatId, participants: [currentUserId, sellerId] });
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
    console.log('session', session);

    if (session) {
      const user = await Users.findOne({ email: session.user.email }).populate({ path: 'chats', populate: { path: 'participants' } })
      console.log('user', user);
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
    console.log('user.chats from addChat', user.chats);
    console.log('!user.chats.includes(chatId):', user.chats.includes(chatId));

    if (!user.chats.includes(chatId)) {
      user.chats.push([chatId]);
      console.log('Added new chat to user');
    }
    await user.save();
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
