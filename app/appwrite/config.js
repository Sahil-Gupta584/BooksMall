import { Client, Account, Databases, Storage, Avatars,ID } from "appwrite";

const appwriteConfig = {
    url: process.env.NEXT_PUBLIC_APPWRITE_URL,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID,
    booksCollectionId: process.env.NEXT_PUBLIC_APPWRITE_BOOKS_COLLECTION_ID,
    chatCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHAT_COLLECTION_ID,
  };

 const client = new Client();
console.log(appwriteConfig.url)
client
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);

 const account = new Account(client);
 const database = new Databases(client);
 const storage = new Storage(client);
 const avatar = new Avatars(client);
export {ID,account,database,storage,avatar,appwriteConfig}
