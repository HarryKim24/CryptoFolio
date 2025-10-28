"use server";

import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId, OptionalId } from "mongodb";
import { Asset } from "@/types/assetTypes";

export async function getAssets(userId: string): Promise<Asset[]> {
  const client = await clientPromise;
  const db = client.db("crypto");
  const data = await db.collection<Asset>("assets").find({ userId }).toArray();

  return data.map((asset) => ({
    ...asset,
    _id: asset._id?.toString(),
  }));
}

export async function addAsset(asset: Asset) {
  const client = await clientPromise;
  const db = client.db("crypto");

  const assetToInsert = { ...asset };
  delete assetToInsert._id;

  const result = await db.collection<Asset>("assets").insertOne(assetToInsert as OptionalId<Asset>);
  revalidatePath("/portfolio");

  return result.insertedId.toString();
}

export async function deleteAsset(id: string) {
  const client = await clientPromise;
  const db = client.db("crypto");
  await db.collection("assets").deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/portfolio");
}

export async function deleteAllAssets(userId: string) {
  const client = await clientPromise;
  const db = client.db("crypto");
  await db.collection("assets").deleteMany({ userId });
  revalidatePath("/portfolio");
}