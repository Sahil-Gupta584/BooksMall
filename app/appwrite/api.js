
import { Query } from "appwrite";
import { ID,account,database,storage,avatar,appwriteConfig } from "./config";

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
export function getFilePreview(fileId) {
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
    console.log(error,'from getFilePreview');
  }
}

export async function saveToDb(bookData, coverImageIndex, images, location, userId) {
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
    const bookDetails = { ...bookData, coverImageIndex, bookImages, state: location.state, city: location.city, timestamp: Date.now().toString(), userId };
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
    const bookDetails = { ...bookData, coverImageIndex, bookImages, timestamp: Date.now().toString() };
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
    console.log(err.message, err, "from saveToDb");
    return false;
  }
}

export async function getBook(bookId) {
  try {
    console.log(bookId)
    const book = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.booksCollectionId,
      bookId
    )
    console.log(book)
    const seller = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      book.userId
    )
    console.log(seller)
    return {...book,seller: {...seller}}
  } catch (error) {
    console.log(error, 'from getBook')
    return error
  }
}

export async function createUser(email, password, name) {
  try {
    const user = await  account.create(ID.unique(), email, password, name.toUpperCase());
    await account.createEmailPasswordSession(email,password);
    const avatarUrl = avatar.getInitials(name).href;
    const res = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId, 
      user.$id, 
      { name, avatarUrl,email }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error, 'from createUser');
    return false;
  }
}

export async function getChatPartners(currentUserId) {
  console.log('currentUserId: ', currentUserId);

  try {
    const res = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUserId ||currentUserId.$id
    );
    const partners = res.chatPartners.map(async (p,i)=> await getUser(p))
    console.log(res)
    return Promise.all(partners)
  } catch (error) {
    console.log(error,'from getChatPartners')
  }
}

export async function addChatPartner(currentUserId,partnerId) {
  console.log('addingpartner')
  try {
    
    const res = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUserId
    )

    console.log(res)
    await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUserId,
      {
        chatPartners: [...res.chatPartners ,partnerId]
      }
    )
  } catch (error) {
   console.log(error,'from addChatPartner'); 
  }
}

export async function getUser(Id) {
  try {
    
    return await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      Id
    )
  } catch (error) {
   console.log(error,'from getUser'); 
  }
}

// Add these functions to appwrite/api.js

export async function saveMessage(senderId, receiverId, content) {
  try {
    const message = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatCollectionId,
      ID.unique(),
      {
        senderId,
        receiverId,
        content,
        timestamp: Date.now()
      }
    );
    return message;
  } catch (error) {
    console.log(error, 'from saveMessage');
    return null;
  }
}

export async function getPreviousMessages(userId1, userId2) {
  console.log(appwriteConfig,'appwriteConfig.chatCollectionId')
  try {
    const messages = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatCollectionId,
      [
        Query.equal('senderId', [userId1, userId2]),
        Query.equal('receiverId', [userId1, userId2]),
        Query.orderDesc('timestamp')
      ]
    );
    return messages.documents;
  } catch (error) {
    console.log(error, 'from getPreviousMessages');
    return [];
  }
}

export { account, storage, database };
