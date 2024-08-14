import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.techtorch.aora',
    projectId: '66bc8db4002c41a6098b',
    databaseId: '66bc9012000679015aac',
    userCollectionId: '66bc904b002fa3232263',
    videoCollectionId: '66bc90a100106c0c63cb',
    storageId: '66bc93d70007856606cd',
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

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

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

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