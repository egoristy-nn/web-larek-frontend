export interface IUser extends IOrderForm, IContactsForm {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]
}

export interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IOrderForm {
  payment: string;
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type FormErrors = Partial<Record<keyof IUser, string>>;

export type TItemModal = Omit<IItem, 'id'>;

export type TItemBasket = {
  index: string;
  title: string;
  price: string;
};