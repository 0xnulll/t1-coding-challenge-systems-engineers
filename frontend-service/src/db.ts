import {
    MongoClient,
    Db,
    Collection
} from 'mongodb';

let db: Db;

// Initialize MongoDB connection
async function connectToMongoDB(uri: string, dbName: string) {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB: ${dbName}`);
}

// Function to get a collection
export function dbGetCollection(collectionName: string): Collection {
    if (!db) {
        throw new Error('Database not initialized. Call connectToMongoDB first.');
    }
    return db.collection(collectionName);
}

connectToMongoDB("mongodb://database:27017/tradingDB", "tradingDB");