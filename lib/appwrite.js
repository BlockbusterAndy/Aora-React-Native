import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.techtorch.aora',
  projectId: '66bc8db4002c41a6098b',
  databaseId: '66bc9012000679015aac',
  userCollectionId: '66bc904b002fa3232263',
  videoCollectionId: '66bc90a100106c0c63cb',
  storageId: '66bc93d70007856606cd',
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


// Sign In
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Sign Out
export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
}

// Create User
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if(!newAccount) throw new Error('User not created');
        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument( 
            config.databaseId, 
            config.userCollectionId, 
            ID.unique(), 
            {
                accountId: newAccount.$id,
                username,
                email,
                avatar: avatarUrl
            },
        );

        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

//Get Current User
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw new Error();

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw new Error();

        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error);
        console.log(error);
    }
}

// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
}
  
// Upload File
export async function uploadFile(file, type) {
    if (!file) return;
    
    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };
    
    try {
        const uploadedFile = await storage.createFile(
        config.storageId,
        ID.unique(),
        asset
        );
    
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}
  
// Get File Preview
export async function getFilePreview(fileId, type) {
let fileUrl;

    try {
      if (type === "video") {
        fileUrl = storage.getFileView(config.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          config.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
}
  
// Create Video Post
export async function createVideoPost(form) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        config.databaseId,
        config.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
}
  
// Get all video Posts
export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}
  
// Get video posts created by user
export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId,
        [Query.equal("creator", userId)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}
  
// Get video posts that matches search query
export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId,
        [Query.search("title", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}
  
// Get latest created video posts
export async function getLatestPosts() {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(7)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
}