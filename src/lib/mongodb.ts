import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect();
}

const clientPromise = globalWithMongo._mongoClientPromise!;
export default clientPromise;