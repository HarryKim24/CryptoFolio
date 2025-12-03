"use server";

import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Asset } from "@/types/assetTypes";

const DATABASE_NAME = "crypto";
const ASSETS_COLLECTION_NAME = "assets";

interface MongoAsset {
  _id: ObjectId;
  userId: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  date: string | Date; 
  type: 'buy' | 'sell';
}

export async function getAssets(userId: string): Promise<Asset[]> {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(ASSETS_COLLECTION_NAME);

    const rawAssets = (await collection
      .find({ userId })
      .toArray()) as unknown as MongoAsset[];

    return rawAssets.map((doc) => ({
      userId: doc.userId,
      symbol: doc.symbol,
      name: doc.name,
      quantity: doc.quantity,
      averagePrice: doc.averagePrice,
      date: doc.date.toString(),
      type: doc.type,
      _id: doc._id.toString(),
    }));

  } catch (e) {
    console.error("자산 로딩 실패:", e);
    return [];
  }
}

export async function addAsset(asset: Asset) {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const collection = db.collection(ASSETS_COLLECTION_NAME);
  const assetData = {
    userId: asset.userId,
    symbol: asset.symbol,
    name: asset.name,
    quantity: asset.quantity,
    averagePrice: asset.averagePrice,
    date: asset.date,
    type: asset.type,
  };

  const result = await collection.insertOne(assetData);

  revalidatePath("/portfolio");
  return result.insertedId.toString();
}

export async function deleteAsset(id: string) {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const collection = db.collection(ASSETS_COLLECTION_NAME);

  await collection.deleteOne({ _id: new ObjectId(id) });

  revalidatePath("/portfolio");
}

export async function deleteAllAssets(userId: string) {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const collection = db.collection(ASSETS_COLLECTION_NAME);

  await collection.deleteMany({ userId });

  revalidatePath("/portfolio");
}