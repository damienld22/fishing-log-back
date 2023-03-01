import { Db, ObjectId } from "mongodb";
import { NewShoppingListItem, ShoppingListItem } from "../models/shopping";

export class ShoppingService {
  static db: Db;
  static collectionName = "shopping";

  static setDb(db: Db) {
    this.db = db;
  }

  static async getAllItems(): Promise<ShoppingListItem[]> {
    console.debug(`Get items from ${this.collectionName} collection`);
    const itemsFromDb = await this.db
      .collection(this.collectionName)
      .find()
      .toArray();
    return itemsFromDb as unknown as ShoppingListItem[];
  }

  static async addNewItem(
    item: NewShoppingListItem
  ): Promise<ShoppingListItem> {
    console.debug(
      `Add item ${item.label} to ${this.collectionName} collection`
    );
    const { insertedId } = await this.db
      .collection(this.collectionName)
      .insertOne(item);
    return { ...item, _id: insertedId.toString() };
  }

  static async deleteItem(itemId: string): Promise<ShoppingListItem> {
    console.debug(
      `Remove item ${itemId} from ${this.collectionName} collection`
    );
    const { value } = await this.db
      .collection(this.collectionName)
      .findOneAndDelete({ _id: new ObjectId(itemId) });
    return value as unknown as ShoppingListItem;
  }
}
