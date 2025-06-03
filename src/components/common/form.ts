import { IEvents } from "../base/events";
import { cloneTemplate } from '../../utils/utils';

export class Form<T> {
	protected _form: HTMLFormElement;
	protected _formName: string;
	protected _fields: HTMLInputElement[];
	protected _submitButton: HTMLButtonElement;
	protected _errors: HTMLSpanElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this._form = cloneTemplate(template);
		this._formName = this._form.name;
		this._fields = Array.from(this._form.querySelectorAll('input'));
		this._submitButton = this._form.querySelector('button[type="submit"]')!;
		this._errors = this._form.querySelector('.form__errors')!;

		this._initListeners();
	}

	protected _initListeners(): void {
		this._fields.forEach((input) =>
			input.addEventListener('input', () => this._handleInput(input))
		);

		this._form.addEventListener('submit', (e) => this._handleSubmit(e));
	}

	protected _handleInput(input: HTMLInputElement): void {
		const field = input.name as keyof T;
		const value = input.value;
		this.onInputChange(field, value);
	}

	protected _handleSubmit(e: Event): void {
		e.preventDefault();
		this.events.emit(`${this._formName}:submit`);
	}

	clearInputs(): void {
		this._fields.forEach(input => input.value = '');
	}

	disableSubmitButton(): void {
		this._submitButton.disabled = true;
	}

	protected onInputChange(field: keyof T, value: string): void {
		this.events.emit(`${this._formName}Input:change`, { field, value });
	}

	set valid(isValid: boolean) {
		this._submitButton.disabled = !isValid;
	}

	set errors(message: string) {
		this._errors.textContent = message;
	}

	render(): HTMLElement {
		return this._form;
	}
}
