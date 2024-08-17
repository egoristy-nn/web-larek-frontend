export interface IUser {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: IItem[]
}

export interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IItemsData {
  total: number;
  items: IItem[];
  preview: string | null;
  getItem(itemId: string): IItem;
  updateItem(item: IItem, payload: Function | null): void;
}

export interface IUserData {
  getUserInfo(): TUserModal;
  setUserInfo(userData: IUser): void;
}

export type TItemPublic = Omit<IItem, 'id' | 'description'>;

export type TItemModal = Omit<IItem, 'id'>;

export type TItemBasket = Pick<IItem, 'title' | 'price'>;

export type TUserModal = Omit<IUser, 'items'>;