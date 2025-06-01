import { IView } from '../../types';
import { cloneTemplate, handlePrice } from '../../utils/utils';
import { IEvents } from '../base/events';

export class CartView implements IView {

	protected _content: HTMLElement;
	protected _cartList: HTMLElement;
	protected _orderButton: HTMLButtonElement;
	protected _totalPrice: HTMLSpanElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this._content = cloneTemplate(template);

		this._cartList = this._content.querySelector('.basket__list');
		this._orderButton = this._content.querySelector('.basket__button');
		this._totalPrice = this._content.querySelector('.basket__price');

		this._orderButton.addEventListener('click', () => {
			this.events.emit('cart:order');
		});
	}

	render({ content, price }: { content: HTMLElement[]; price: number }): HTMLElement {
		this._cartList.replaceChildren(...content);
		this._orderButton.disabled = content.length === 0;
		this._totalPrice.textContent = `${handlePrice(String(price))} синапсов`;
		return this._content;
	}
}
