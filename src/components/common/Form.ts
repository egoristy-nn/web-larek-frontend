import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IFormState {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement('.button[type=submit]', this.container) as HTMLButtonElement;
    this._errors = ensureElement('.form__errors', this.container) as HTMLElement;

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    })

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    })
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
  }

  set valid (value: boolean) {
    this._submit.disabled = !value;
  }

  set errors (value: string) {
    this.setText(this._errors, value);
  }

  render(state: Partial<T> & IFormState) {
    const {valid, errors, ...inputs} = state;
    super.render({valid, errors});
    Object.assign(this, inputs);
    return this.container;
  }
}