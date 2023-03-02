export type FishingPlace = {
  _id: string;
  name: string;
  link?: string;
  nightFishing?: boolean | string;
  boatAuthorized?: boolean | string;
  surface?: number;
  infos?: string;
  posts: FishingPost[];
};

export type NewFishingPlace = Omit<FishingPlace, "_id" | "posts">;

export type FishingPost = {
  _id: string;
  name: string;
  location: GPSPosition;
  infos: string;
};

export type GPSPosition = {
  longitude: number;
  latitude: number;
};

export type NewFishingPost = Omit<FishingPost, "_id">;
