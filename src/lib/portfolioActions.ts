"use server";

import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId, OptionalId } from "mongodb";
import { Asset } from "@/types/assetTypes";

const DATABASE_NAME = "crypto";
const ASSETS_COLLECTION_NAME = "assets";

export async function getAssets(userId: string): Promise<Asset[]> {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const assetsCollection = db.collection<Asset>(ASSETS_COLLECTION_NAME);

  const assets = await assetsCollection.find({ userId }).toArray();

  return assets.map((asset) => {
    const assetId = asset._id ? asset._id.toString() : undefined;

    return {
      ...asset,
      _id: assetId,
    };
  });
}

export async function addAsset(asset: Asset) {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const assetsCollection = db.collection<Asset>(ASSETS_COLLECTION_NAME);

  const assetToInsert: Asset = { ...asset };
  delete (assetToInsert as Partial<Asset>)._id;

  const insertResult = await assetsCollection.insertOne(
    assetToInsert as OptionalId<Asset>
  );

  revalidatePath("/portfolio");

  return insertResult.insertedId.toString();
}

export async function deleteAsset(id: string) {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const assetsCollection = db.collection(ASSETS_COLLECTION_NAME);

  const objectId = new ObjectId(id);

  await assetsCollection.deleteOne({ _id: objectId });

  revalidatePath("/portfolio");
}

export async function deleteAllAssets(userId: string) {
  const client = await clientPromise;
  const db = client.db(DATABASE_NAME);
  const assetsCollection = db.collection(ASSETS_COLLECTION_NAME);

  await assetsCollection.deleteMany({ userId });

  revalidatePath("/portfolio");
}