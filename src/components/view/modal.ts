import { IModal, IView } from '../../types';
import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';

export class Modal implements IModal {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		this._content = this.container.querySelector('.modal__content');
		this._closeButton = this.container.querySelector('.modal__close');

		this._closeButton.addEventListener('click', () => {
			this.closeModal();
			this.events.emit('order:succes');
		});
				this.container.addEventListener('click', (event: MouseEvent) => {
			if (event.target === this.container) {
				this.closeModal();
			}
		});
	}

	showModal() {
		this.container.classList.add('modal_active');
	}

	closeModal() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	render() {
		this.showModal();

		return this.container;
	}
}

export class SuccessModal implements IView {

	protected _content: HTMLElement;
	protected _price: HTMLSpanElement;
	protected _submitButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this._content = cloneTemplate(template);
		this._price = this._content.querySelector('.order-success__description');
		this._submitButton = this._content.querySelector('.order-success__close');

		this._submitButton.addEventListener('click', () => {
			this.events.emit('order:success');
		});
	}

	render(data: { price: number }): HTMLElement {

		this._price.textContent = `Списано ${data.price} синапсов`;

		this.events.emit('order:success');

		return this._content;
	}
}