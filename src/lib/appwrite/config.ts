import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: "https://cloud.appwrite.io/v1", // Updated URL value
  projectId: "6557152ea0557d9987be", // Updated project ID value
  databaseId: "65573238b6b0cfabf031", // Updated database ID value
  storageId: "655731fab3467412e016", // Updated storage ID value
  userCollectionId: "655732b42b715df9d9e3", // Updated user collection ID value
  postCollectionId: "6557327f3f43b963e688", // Updated post collection ID value
  savesCollectionId: "655732ec197d9b7f758f", // Updated saves collection ID value
  followersCollectionId: "6558b51599aae0c5dd02",
  followingsCollectionId: "6558d0b0a682b55ed9bc",
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
