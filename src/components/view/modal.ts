import { IModal } from '../../types';
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

	/**
	 * Отображает сообщение об успешной покупке
	 */
	showSuccess(price: number, template: HTMLTemplateElement) {
		const content = cloneTemplate(template);
		const description = content.querySelector('.order-success__description') as HTMLElement;
		const button = content.querySelector('.order-success__close') as HTMLButtonElement;

		description.textContent = `Списано ${price} синапсов`;

		button.addEventListener('click', () => {
			this.closeModal();
			this.events.emit('order:success');
		});

		this.content = content;
		this.showModal();
	}
}
