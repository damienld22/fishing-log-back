import {
  Route,
  Get,
  Tags,
  Post,
  Body,
  Delete,
  Path,
  Patch,
  SuccessResponse,
  Controller,
} from "tsoa";
import { ErrorMessage } from "../models/errors";
import {
  FishingPlace,
  FishingPost,
  NewFishingPlace,
  NewFishingPost,
} from "../models/places";
import { PlacesService } from "../services/places";

@Route("places")
@Tags("places")
export class PlacesController extends Controller {
  @Get()
  public async getItems(): Promise<FishingPlace[]> {
    const items = await PlacesService.getAllItems();
    return items;
  }

  @Post()
  @SuccessResponse("201")
  public async addItem(@Body() item: NewFishingPlace): Promise<FishingPlace> {
    const createdItem = await PlacesService.addNewItem(item);
    return createdItem;
  }

  @Delete("{itemId}")
  public async deleteItem(
    @Path() itemId: string
  ): Promise<FishingPlace | ErrorMessage> {
    const deletedItem = await PlacesService.deleteItem(itemId);

    if (!deletedItem) {
      this.setStatus(404);
      return { message: "Not found" };
    }
    return deletedItem;
  }

  @Patch("{itemId}")
  public async patchItem(
    @Path() itemId: string,
    @Body() properties: Partial<FishingPlace>
  ): Promise<FishingPlace | ErrorMessage> {
    const editedItem = await PlacesService.editItem(itemId, properties);

    if (!editedItem) {
      this.setStatus(404);
      return { message: "Not found" };
    }
    return editedItem;
  }

  @Post("/{itemId}/posts")
  @SuccessResponse("201")
  public async addPost(
    @Path() itemId: string,
    @Body() post: NewFishingPost
  ): Promise<FishingPost> {
    const createdItem = await PlacesService.addPost(itemId, post);
    return createdItem;
  }

  @Delete("{itemId}/posts/{postId}")
  public async deletePost(
    @Path() itemId: string,
    @Path() postId: string
  ): Promise<string | ErrorMessage> {
    const deletedItemId = await PlacesService.deletePost(itemId, postId);

    if (!deletedItemId) {
      this.setStatus(404);
      return { message: "Not found" };
    }
    return deletedItemId;
  }

  @Patch("{itemId}/posts/{postId}")
  public async editPost(
    @Path() itemId: string,
    @Path() postId: string,
    @Body() properties: Partial<FishingPost>
  ): Promise<string | ErrorMessage> {
    const editedItemId = await PlacesService.editPost(
      itemId,
      postId,
      properties
    );

    if (!editedItemId) {
      this.setStatus(404);
      return { message: "Not found" };
    }
    return editedItemId;
  }
}
