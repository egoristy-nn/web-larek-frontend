import { IItem, TItemModal } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class Card<T> extends Component<IItem> {
  protected cardId: string;
  protected cardTitle: HTMLElement;
  protected cardCategory?: HTMLElement;
  protected cardImage?: HTMLImageElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement('.card__title', this.container);
    this.cardCategory = ensureElement('.card__category', this.container);
    this.cardImage = ensureElement('.card__image', this.container) as HTMLImageElement;
    this.cardPrice = ensureElement('.card__price', this.container);
  }
  set title (value: string) {
    this.setText(this.cardTitle, value);
  }

  set category (value: string) {
    this.setText(this.cardCategory, value);
    if (value === 'другое') {
      this.toggleClass(this.cardCategory, 'card__category_other');
    }
    if (value === 'дополнительное') {
      this.toggleClass(this.cardCategory, 'card__category_additional');
    }
    if (value === 'кнопка')
    {
      this.toggleClass(this.cardCategory, 'card__category_button');
    }
    if (value === 'хард-скил') {
      this.toggleClass(this.cardCategory, 'card__category_hard');
    }
  }

  set image (src: string) {
    this.setImage(this.cardImage, CDN_URL + src);
  }

  set price (value: string) {
    this.setText(this.cardPrice, `${value} синапсов`);
    if (value === null) {
      this.setText(this.cardPrice, `Бесценно`);
    }
  }

  set id (value: string) {
    this.cardId = value;
  }
}

export class CardModal extends Card<TItemModal> {
  protected cardButton: HTMLElement;
  protected cardDescription: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.cardButton = ensureElement('.card__button', this.container);
    this.cardDescription = ensureElement('.card__text', this.container);

    this.cardButton.addEventListener('click', () => {

      if (this.cardButton.textContent === `В корзину`) {
        this.events.emit('item:added', {
          id: this.cardId,
          price: parseInt(this.cardPrice.textContent)},
        );
        this.cardButton.textContent = `Удалить из корзины`;
      }
      else {
        this.events.emit('item:deleted', {
          id: this.cardId,
          price: parseInt(this.cardPrice.textContent)});
        this.cardButton.textContent = `В корзину`;
      }
    })
  }

  set description (value: string) {
    this.setText(this.cardDescription, value);
  }

  set price (value: string) {
    this.setText(this.cardPrice, `${value} синапсов`);
    if (value === null) {
      this.setText(this.cardPrice, `Бесценно`);
      this.cardButton.setAttribute('disabled', 'true');
    }
  }
}

export class CardBasket extends Component<IItem> {

  protected cardId: string;
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected cardIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.cardTitle = ensureElement('.card__title', this.container);
    this.cardPrice = ensureElement('.card__price', this.container);
    this.cardIndex = ensureElement('.basket__item-index', this.container);
    this.deleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('item:deleted', {
        id: this.cardId,
        price: parseInt(this.cardPrice.textContent)
      });
    })
  }

  set id (value: string) {
    this.cardId = value;
  }

 set index (value: string) {
   this.setText(this.cardIndex, value);
 }

  set title (value: string) {
    this.setText(this.cardTitle, value);
  }
  
  set price (value: string) {
    this.setText(this.cardPrice, `${value} синапсов`);
    if (value === null) {
      this.setText(this.cardPrice, `Бесценно`);
    }
  }
}