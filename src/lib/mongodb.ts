import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient;

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  const connectionPromise = client.connect();
  globalWithMongo._mongoClientPromise = connectionPromise;
}

const clientPromise = globalWithMongo._mongoClientPromise || null;

export default clientPromise;