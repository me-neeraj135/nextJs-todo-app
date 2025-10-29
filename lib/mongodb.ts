import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to your .env.local');
}

// Replace environment variables in the URI
const uri = process.env.MONGODB_URI
  .replace('$DB_USER', process.env.DB_USER || '')
  .replace('$DB_PASSWORD', process.env.DB_PASSWORD || '');



const dbName = process.env.MONGODB_DB || 'blog-markdown-db';


// MongoDB connection options
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Helper function to get database instance and verify connection
export async function getDb(): Promise<import("mongodb").Db> {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    // Verify connection with a lightweight ping
    await db.command({ ping: 1 });
    return db;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Initialize database connection
export async function initializeDatabase() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    console.log('[MongoDB] Connected successfully to', dbName);
    console.log('[MongoDB] Available collections:', collections.map(c => c.name).join(', '));
    return true;
  } catch (error) {
    console.error('[MongoDB] Initialization failed:', error);
    return false;
  }
}

export default clientPromise;