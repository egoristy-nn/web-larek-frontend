import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IModal {
  content: HTMLElement;
}
export class Modal extends Component<IModal> {
  protected closeButtonModal: HTMLButtonElement;
  protected contentModal: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButtonModal = ensureElement('.modal__close', this.container) as HTMLButtonElement;
    this.contentModal = ensureElement('.modal__content', this.container);

    this.closeButtonModal.addEventListener('click', () => {
      this.close();
    });

    this.container.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (target === this.container) {
        this.close();
      }
    })
  }

  set content (value: HTMLElement) {
    this.contentModal.replaceChildren(value);
  }

  open() {
    this.container.classList.toggle('modal_active');
    this.events.emit('modal:open');
  }

  close() {
    this.container.classList.toggle('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}