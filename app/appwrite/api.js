'use server';
import { Query } from "appwrite";
import { ID, account, database, storage, avatar, appwriteConfig } from "./config";
import { auth, signIn, signOut } from "@/auth";

export async function handleSignUp(name, email, password) {

  await signIn('credentials', { name, email, password, redirectTo:'/' });
 
}

export async function handleLogin(email, password) {
  try {
    await signIn('credentials', { email, password,redirectTo:'/' });
  } catch (error) {
    console.log(error, 'from handleLogin');
    throw error
  }

}

export async function logOut() {
  await signOut({redirectTo:'/auth'})
}
export async function verifyLogin() {
  try {
    return await account.get();
  } catch (error) {
    console.log(error.message, error, 'from verifylogin')
    return false;
  }
}

export async function uploadFile(imageFile) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      imageFile,
    );

    return uploadedFile;
  } catch (error) {
    console.log(error.message, error, "from uploadFilwe");
  }
}
export async function getFilePreview(fileId) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100,
    );

    console.log(fileUrl, "from getFilePreview");
    return fileUrl.href;
  } catch (error) {
    console.log(error, 'from getFilePreview');
  }
}

export async function saveToDb(bookData, coverImageIndex, images, location, ownerId) {
  try {

    const files = images.filter(image => image instanceof File);
    const urls = images.filter(image => typeof image === 'string');

    const uploadedFile = await Promise.all(
      files.map(async (image) => await uploadFile(image)),
    );
    console.log('uploadedFile:', uploadedFile)

    const bookImages = await Promise.all(
      uploadedFile.map(async (file) => getFilePreview(file.$id)),
    );

    const imageUrls = [...urls, ...bookImages];
    console.log('imageUrls:', imageUrls)
    const bookDetails = { ...bookData, coverImageIndex, bookImages, state: location.state, city: location.city, timestamp: Date.now().toString(), ownerId };
    console.log(bookDetails);

    const newBook = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      ID.unique(),
      bookDetails,
    );
    return true;
  } catch (err) {
    console.log(err.message, err, "from saveToDb");
    return false;
  }
}
export async function updateBook(bookId, bookData, coverImageIndex, images) {
  try {

    const files = images.filter(image => image instanceof File);
    const urls = images.filter(image => typeof image === 'string');

    const uploadedFile = await Promise.all(
      files.map(async (image) => await uploadFile(image)),
    );
    console.log('uploadedFile:', uploadedFile)

    const bookImages = await Promise.all(
      uploadedFile.map(async (file) => getFilePreview(file.$id)),
    );

    const imageUrls = [...urls, ...bookImages];
    console.log('imageUrls:', imageUrls)
    const bookDetails = { ...bookData, coverImageIndex, bookImages: [...imageUrls], timestamp: Date.now().toString() };
    console.log(bookDetails);

    const updatedBook = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      bookId,
      bookDetails,
    );
    console.log('updatedBook:', updatedBook)
    return true;
  } catch (err) {
    console.log(err.message, err, "from updateBook  ");
    return false;
  }
}

export async function getBook(bookId) {
  try {
    const book = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      bookId
    )
    return book
  } catch (error) {
    console.log(error, 'from getBook')
    return error
  }
}

export async function getUserBooks(userId) {
  try {

    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      [Query.equal("ownerId", userId), Query.orderDesc("$createdAt")]
    );

    return response.documents;
  } catch (err) {
    console.log(err.message, err, "from getUserBooks");
  }
}

export async function deleteUserBook(userId, bookId) {
  try {

    const res = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      bookId
    )

    console.log(res, 'book deleted');
    return true
  } catch (error) {
    console.log(error.message, error, 'from deleteUserBook');
    return false
  }

}
export async function createUser(email, password, name) {
  try {
    const user = await account.create(ID.unique(), email, password, name.toUpperCase());
    localStorage.setItem('currentUserId', user.$id)
    const avatarUrl = avatar.getInitials(name).href;
    const res = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.$id,
      { name, avatarUrl, email }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error, 'from createUser');
    throw error;
  }
}


export async function getChatPartners(currentUserId) {
  console.log('currentUserId: ', currentUserId);

  try {
    const res = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUserId || currentUserId.$id
    );
    const partners = res.chatPartners.map(async (p, i) => await getUser(p))
    console.log(res)
    return Promise.all(partners)
  } catch (error) {
    console.log(error, 'from getChatPartners')
  }
}

export async function getChat(chatId, sellerId, currentUser) {
  console.log('gettingChat', chatId);
  console.log('sellerId', sellerId)
  console.log('currenUserId', currentUser?.$id)
  try {
    // Try to get the existing chat
    const existingChat = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatCollectionId,
      chatId
    );

    console.log('Chat already exists:', existingChat);
    return existingChat;
  } catch (error) {
    // If the error is 'document not found', create a new chat
    if (error.code === 404) {
      console.log('Chat not found, creating new chat');
      try {
        const newChat = await database.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.chatCollectionId,
          chatId,
          {
            participants: [currentUser.$id, sellerId]
          }
        );

        if (!currentUser.chats.includes(chatId)) {
          console.log('updated chats for user')
          await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.$id,
            {
              chats: [
                ...currentUser.chats,
                newChat.$id
              ]
            }
          )
        }

        // console.log('Created new chat:', newChat);
        return newChat;
      } catch (createError) {
        console.log('Error creating new chat:', createError.message, createError);
      }
    } else {
      // If it's a different error, log and rethrow it
      console.log(error, 'Error in getChat');
    }
  }
}

export async function getUser(Id) {
  console.log(`getting user:`, Id)
  try {

    return await auth()
  } catch (error) {
    console.log(error, 'from getUser');
  }
}

// Add these functions to appwrite/api.js

export async function uploadMessage(message) {
  try {
    console.log('message:', message)
    const res = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messageCollectionId,
      ID.unique(),
      { ...message }
    );
  } catch (error) {
    console.log(error, 'from uploadMessage');
  }
}

export async function getPreviousMessages(chatId) {
  console.log('getting previous messages of chat', chatId)
  try {
    const messages = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messageCollectionId,
      [
        Query.equal('chatId', chatId),
        Query.orderAsc('timestamp'),
        Query.limit(10000)
      ]
    );
    return messages.documents;
  } catch (error) {
    console.log(error, 'from getPreviousMessages');
    return [];
  }
}

export async function deleteDocument(params) {
  await database.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.messageCollectionId,
    params
  )
}

export async function updateMessageSeen(chatId) {
  try {

    console.log('updating message seen for chat', chatId)
    const messages = await getPreviousMessages(chatId);
    messages.forEach(async (message) => {

      await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.messageCollectionId,
        message.$id,
        {
          status: 'seen',
        }
      )

    })
  } catch (error) {
    console.log(error.message, error, 'from updateMessageSeen');
  }
}

export async function addChatToUser(currentUserId, chatId) {
  try {
    const user = await getUser(currentUserId)

    if (!user.chats.includes(chatId)) {

      await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        currentUserId,
        {
          chats: [
            ...user.chats,
            chatId
          ]
        }

      )

      console.log('updated user chats')
    }
  } catch (error) {
    console.log(error, 'from addChatToUser');
    return error
  }
}

export async function getAllBooks() {
  try {

    const res = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      [
        Query.orderAsc('timestamp'),
      ]

    )
    return res.documents
  } catch (error) {
    console.log(error.message, error, 'from getAllBooks');
    return false
  }
}
