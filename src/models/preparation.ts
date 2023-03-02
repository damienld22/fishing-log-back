export type PreparationItem = {
  label: string;
  checked: boolean;
};

export type PreparationCategory = {
  _id: string;
  label: string;
  items: PreparationItem[];
};

export type NewPreparationCategory = Omit<PreparationCategory, "_id" | "items">;
