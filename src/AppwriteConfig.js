import { Client, Account, Storage, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_TEACHERS = import.meta.env.VITE_APPWRITE_COLLECTION_ID_TEACHERS;

export { client, account, storage, databases, BUCKET_ID, PROJECT_ID, DATABASE_ID, COLLECTION_ID_TEACHERS, ID };
