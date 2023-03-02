import { Db, ObjectId } from "mongodb";
import {
  FishingPlace,
  FishingPost,
  NewFishingPlace,
  NewFishingPost,
} from "../models/places";

export class PlacesService {
  static db: Db;
  static collectionName = "places";

  static setDb(db: Db) {
    this.db = db;
  }

  static async getAllItems(): Promise<FishingPlace[]> {
    console.debug(`Get items from ${this.collectionName} collection`);
    const itemsFromDb = await this.db
      .collection(this.collectionName)
      .find()
      .toArray();
    return itemsFromDb as unknown as FishingPlace[];
  }

  static async addNewItem(item: NewFishingPlace): Promise<FishingPlace> {
    console.debug(`Add item ${item.name} to ${this.collectionName} collection`);
    const { insertedId } = await this.db
      .collection(this.collectionName)
      .insertOne({ ...item, posts: [] });
    return { ...item, posts: [], _id: insertedId.toString() };
  }

  static async deleteItem(itemId: string): Promise<FishingPlace> {
    console.debug(
      `Remove item ${itemId} from ${this.collectionName} collection`
    );
    const { value } = await this.db
      .collection(this.collectionName)
      .findOneAndDelete({ _id: new ObjectId(itemId) });
    return value as unknown as FishingPlace;
  }

  static async editItem(
    itemId: string,
    properties: Partial<FishingPlace>
  ): Promise<FishingPlace> {
    console.debug(`Edit item ${itemId} from ${this.collectionName} collection`);
    const { value } = await this.db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(itemId) },
        { $set: properties },
        { returnDocument: "after" }
      );
    return value as unknown as FishingPlace;
  }

  static async addPost(
    itemId: string,
    post: NewFishingPost
  ): Promise<FishingPost> {
    console.debug(
      `Add post in ${itemId} from ${this.collectionName} collection`
    );
    const _id = new ObjectId();
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { _id: new ObjectId(itemId) },
        { $push: { posts: { ...post, _id } } }
      );
    return { ...post, _id: _id.toString() };
  }

  static async deletePost(itemId: string, postId: string): Promise<string> {
    console.debug(
      `Delete post ${postId} in item ${itemId} from ${this.collectionName} collection`
    );
    await this.db
      .collection(this.collectionName)
      .updateOne(
        { _id: new ObjectId(itemId) },
        { $pull: { posts: { _id: new ObjectId(postId) } } }
      );
    return postId;
  }

  static async editPost(
    itemId: string,
    postId: string,
    properties: Partial<FishingPost>
  ): Promise<string | null> {
    console.debug(
      `Edit post ${postId} in item ${itemId} from ${this.collectionName} collection`
    );

    const currentItem = (await this.db
      .collection(this.collectionName)
      .findOne({ _id: new ObjectId(itemId) })) as unknown as FishingPlace;

    if (!currentItem) {
      return null;
    }

    const currentPost = currentItem.posts.find(
      (post) => post?._id?.toString() === postId
    );

    if (!currentPost) {
      return null;
    }

    const updatedPost = { ...currentPost, ...properties };

    await this.db
      .collection(this.collectionName)
      .updateOne(
        { _id: new ObjectId(itemId), "posts._id": new ObjectId(postId) },
        { $set: { "posts.$": updatedPost } }
      );

    return postId;
  }
}
