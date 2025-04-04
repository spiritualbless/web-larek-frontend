import { OrderForm } from '../types';
import { EventEmitter } from './base/events';
import { FormHandler } from './common/FormHandler';

export class Contacts extends FormHandler<OrderForm> {
	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
