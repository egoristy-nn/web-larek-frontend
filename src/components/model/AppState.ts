import { FormErrors, IContactsForm, IItem, IOrderForm, IUser } from "../../types";
import { IEvents } from "../base/events";

export class AppState {
  protected basket: string[];
  protected catalog: IItem[];
  protected order: IUser = {
    payment: "",
    email: "",
    phone: "",
    address: "",
    total: 0,
    items: []
  }

  protected formErrors: FormErrors = {};
  
  constructor(protected events: IEvents) {
    this.basket = [];
  }

  clearBasket() {
    this.order.items = [];
    this.order.payment = "";
    this.order.email = "";
    this.order.phone = "";
    this.order.address = "";
    this.order.total = 0;
  }
  
  getItem(itemId: string): IItem {
    return this.catalog.find(item => item.id === itemId)!;
  }

  getItems(): IItem[] {
    return this.catalog;
  }

  setCatalog(items: IItem[]) {
    this.catalog = items;
    this.events.emit('catalog:changed');
  }

  setPayment(payment: string) {
    this.order.payment = payment;
  }

  setAddress(address: string) {
    this.order.address = address;
  }

  setEmail(email: string) {
    this.order.email = email;
  }

  setPhone(phone: string) {
    this.order.phone = phone;
  }

  getTotal() {
    return this.order.total;
  }

  setTotal(total: number) {
    this.order.total = total;
  }

  getCounter() {
    return this.order.items.length;
  }

  getOrder() {
    return this.order;
  }

  addOrderItem(itemId: string) {
    this.order.items.push(this.getItem(itemId).id);
  }

  deleteOrderItem(itemId: string) {
    this.order.items = this.order.items.filter(item => item !== itemId);
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit('order:ready', this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес доставки';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  setContactsField(field: keyof IContactsForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order);
    }
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать почту';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}

