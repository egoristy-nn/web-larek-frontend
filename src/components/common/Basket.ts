import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";
interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  
  protected itemsList: HTMLElement;
  protected basketTotal: HTMLElement;
  protected orderButton: HTMLElement;
  protected basketParagraph: HTMLElement;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketParagraph = ensureElement('.basket__empty', this.container);
    this.itemsList = ensureElement('.basket__list', this.container);
    this.basketTotal = ensureElement('.basket__price', this.container);
    this.orderButton = ensureElement('.basket__button', this.container);
    
    this.orderButton.addEventListener('click', () => {
      events.emit('basket:submit');
    })
  }

  set items (value: HTMLElement[]) {
    this.itemsList.replaceChildren(...value);

    if (value.length === 0) {
      this.basketParagraph.textContent = 'Корзина пуста';
      this.orderButton.setAttribute('disabled', 'true');
    }
    else {
      this.orderButton.removeAttribute('disabled');
      this.basketParagraph.textContent = '';
    }
  }

  set total (value: number) {
    this.setText(this.basketTotal, `${value} синапсов`);
  }
}