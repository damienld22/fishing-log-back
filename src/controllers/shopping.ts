import { NewShoppingListItem, ShoppingListItem } from "../models/shopping";
import {
  Route,
  Get,
  Tags,
  Post,
  Body,
  Delete,
  Path,
  SuccessResponse,
  Controller,
} from "tsoa";
import { ShoppingService } from "../services/shopping";
import { ErrorMessage } from "../models/errors";

@Route("shopping")
@Tags("shopping")
export class ShoppingController extends Controller {
  @Get()
  public async getItems(): Promise<ShoppingListItem[]> {
    const items = await ShoppingService.getAllItems();
    return items;
  }

  @Post()
  @SuccessResponse("201")
  public async addItem(
    @Body() item: NewShoppingListItem
  ): Promise<ShoppingListItem> {
    const createdItem = await ShoppingService.addNewItem(item);
    return createdItem;
  }

  @Delete("{itemId}")
  public async deleteItem(
    @Path() itemId: string
  ): Promise<ShoppingListItem | ErrorMessage> {
    const deletedItem = await ShoppingService.deleteItem(itemId);

    if (!deletedItem) {
      this.setStatus(404);
      return { message: "Not found" };
    }
    return deletedItem;
  }
}
