
import { ID,account,database,storage,avatar,appwriteConfig } from "./config";

// const client = new Client();

// client
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject("668eac7d0018f544390f");

// const account = new Account(client);
// const storage = new Storage(client);
// const database = new Databases(client);
// const avatar = new Avatars(client);


export async function verifyLogin() {
  try {
    // const { account } = await createSessionClient();
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
    console.log(error);
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
      { name, avatarUrl }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error, 'from saveUser');
    return false;
  }
}
export { account, storage, database };
