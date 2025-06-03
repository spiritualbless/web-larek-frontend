import { Form } from './../common/form';
import { IOrder } from '../../types';
import { IEvents } from '../base/events';

export class OrderForm extends Form<IOrder> {

	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		super(template, events);

		this._buttonCard = this._form.querySelector('button[name="card"]');
		this._buttonCash = this._form.querySelector('button[name="cash"]');

		this._buttonCard.addEventListener('click', () => {
			this._buttonCash.classList.remove('button_alt');
			this._buttonCard.classList.add('button_alt');


			this.onInputChange('payment', 'card');
		});

		this._buttonCash.addEventListener('click', () => {
			this._buttonCard.classList.remove('button_alt');
			this._buttonCash.classList.add('button_alt');

			this.onInputChange('payment', 'cash');
		});
	}

	disableButtons() {
		this._buttonCard.classList.remove('button_alt');
		this._buttonCash.classList.remove('button_alt');
	}
}