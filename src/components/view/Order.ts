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
        button.addEventListener('click', (e: Event) => {
            events.emit('tab:selected', { name: button.name });
            const target = e.target as HTMLButtonElement;
            const name = target.name as keyof IOrderForm;
            const value = target.value;
            this.onSelectChange(name, value);
        });
    })
  }

  
  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set payment(name: string) {
    this.buttons.forEach(button => {
        this.toggleClass(button, 'button_alt-active', button.name === name);
        this.setDisabled(button, button.name === name)
    });
  }

  get address() {
    return (this.container.elements.namedItem('address') as HTMLInputElement).value;
  }

  protected onSelectChange(field: keyof IOrderForm, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
  }
}