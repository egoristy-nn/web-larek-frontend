import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected closeButton: HTMLElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement('.order-success__close', this.container);
    this._total = ensureElement('.order-success__description', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    })
  }

  set total(value: number) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}