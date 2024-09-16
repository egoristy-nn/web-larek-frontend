import { IOrderForm } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";

export class Order extends Form<IOrderForm> {
  
  protected buttons: HTMLButtonElement[];
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);

    this.buttons.forEach(button => {
        button.addEventListener('click', () => {
            events.emit('tab:selected', { name: button.name });
        });
    })
  }

  
  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set selected(name: string) {
    this.buttons.forEach(button => {
        this.toggleClass(button, 'button_alt-active', button.name === name);
        this.setDisabled(button, button.name === name)
    });
  }

  get address() {
    return (this.container.elements.namedItem('address') as HTMLInputElement).value;
  }
}