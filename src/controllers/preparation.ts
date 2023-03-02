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
  NewPreparationCategory,
  PreparationCategory,
} from "../models/preparation";
import { PreparationService } from "../services/preparation";

@Route("preparation")
@Tags("preparation")
export class PreparationController extends Controller {
  @Get()
  public async getItems(): Promise<PreparationCategory[]> {
    const items = await PreparationService.getAllItems();
    return items;
  }

  @Post()
  @SuccessResponse("201")
  public async addItem(
    @Body() item: NewPreparationCategory
  ): Promise<PreparationCategory> {
    const createdItem = await PreparationService.addNewItem(item);
    return createdItem;
  }

  @Delete("{itemId}")
  public async deleteItem(
    @Path() itemId: string
  ): Promise<PreparationCategory | ErrorMessage> {
    const deletedItem = await PreparationService.deleteItem(itemId);

    if (!deletedItem) {
      this.setStatus(404);
      return { message: "Not found" };
    }
    return deletedItem;
  }

  @Patch("{itemId}")
  public async patchItem(
    @Path() itemId: string,
    @Body() properties: Partial<PreparationCategory>
  ): Promise<PreparationCategory | ErrorMessage> {
    const editedItem = await PreparationService.editItem(itemId, properties);

    if (!editedItem) {
      this.setStatus(404);
      return { message: "Not found" };
    }
    return editedItem;
  }
}
