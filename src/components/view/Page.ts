import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IPage {
  itemsList: HTMLElement[];
  basket: HTMLElement;
  counter: number;
  locked: boolean;
}
export class Page extends Component<IPage> {

  protected basketIcon: HTMLElement;
  protected basketCounter: HTMLElement;
  protected itemsContainer: HTMLElement;
  protected wrapper: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketIcon = ensureElement('.header__basket', this.container);
    this.basketCounter = ensureElement('.header__basket-counter', this.container);
    this.itemsContainer = ensureElement('.gallery', this.container);
    this.wrapper = ensureElement('.page__wrapper');

    this.basketIcon.addEventListener('click', () => {
      events.emit('basket:open');
    })
  }

  set itemsList (value: HTMLElement[]) {
    this.itemsContainer.replaceChildren(...value);
  }

  set basket (value: HTMLElement) {
    this.basketIcon.replaceWith(value);
  }

  set counter (value: number) {
    this.setText(this.basketCounter, value);
  }

  set locked(value: boolean) {
    if (value) {
      this.wrapper.classList.add('page__wrapper_locked');
    } else {
      this.wrapper.classList.remove('page__wrapper_locked');
    }
  }
}