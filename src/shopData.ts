import { Item } from "./item/item";

export enum ShopItems {
  TORCH,
  EMPTYHEART,
  FILLHEARTS,
}

export class BuyItem {
  item: Item;
  shopItem: ShopItems; // if item is null we go off this
  price: number;
  unlimited: boolean;
}

export class SellItem {
  item: Item;
  description: string;
  price: number;
}

export class ShopData {
  buyItems: BuyItem[];
  sellItems: SellItem[];

  constructor() {
    this.buyItems = [];
    this.sellItems = [];
  }
}
