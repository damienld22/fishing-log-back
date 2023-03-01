export type ShoppingListItem = {
  _id: string;
  label: string;
};

export type NewShoppingListItem = Omit<ShoppingListItem, "_id">;
