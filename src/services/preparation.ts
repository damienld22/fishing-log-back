import { Db, ObjectId } from "mongodb";
import {
  NewPreparationCategory,
  PreparationCategory,
} from "../models/preparation";

export class PreparationService {
  static db: Db;
  static collectionName = "preparation";

  static setDb(db: Db) {
    this.db = db;
  }

  static async getAllItems(): Promise<PreparationCategory[]> {
    console.debug(`Get items from ${this.collectionName} collection`);
    const itemsFromDb = await this.db
      .collection(this.collectionName)
      .find()
      .toArray();
    return itemsFromDb as unknown as PreparationCategory[];
  }

  static async addNewItem(
    item: NewPreparationCategory
  ): Promise<PreparationCategory> {
    console.debug(
      `Add item ${item.label} to ${this.collectionName} collection`
    );
    const { insertedId } = await this.db
      .collection(this.collectionName)
      .insertOne({ ...item, items: [] });
    return { ...item, items: [], _id: insertedId.toString() };
  }

  static async deleteItem(itemId: string): Promise<PreparationCategory> {
    console.debug(
      `Remove item ${itemId} from ${this.collectionName} collection`
    );
    const { value } = await this.db
      .collection(this.collectionName)
      .findOneAndDelete({ _id: new ObjectId(itemId) });
    return value as unknown as PreparationCategory;
  }

  static async editItem(
    itemId: string,
    properties: Partial<PreparationCategory>
  ): Promise<PreparationCategory> {
    console.debug(`Edit item ${itemId} from ${this.collectionName} collection`);
    const { value } = await this.db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(itemId) },
        { $set: properties },
        { returnDocument: "after" }
      );
    return value as unknown as PreparationCategory;
  }
}
