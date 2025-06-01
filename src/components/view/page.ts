import { IHeader, IPage } from '../../types';
import { IEvents } from '../base/events';


export class Header implements IHeader {
	protected _counter: HTMLSpanElement;
	protected _cartButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		this._cartButton = this.container.querySelector('.header__basket');
		this._counter = this.container.querySelector('.header__basket-counter');

		this._cartButton.addEventListener('click', () => {
				this.events.emit('cart:open');
		})
	}

	set counter(value: number) {
		this._counter.textContent = String(value);
	}

	set cartButton(value: HTMLButtonElement) {
		this._cartButton.replaceChildren(value);
	}

	render() {
		return this.container;
	}
}

export class Page implements IPage {

	protected _header: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {

		this._header = this.container.querySelector('.header');
		this._catalog = this.container.querySelector('.gallery');
		this._wrapper = this.container.querySelector('.page__wrapper');

	}

	set header(value: HTMLElement) {
		this._header = value;
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}

}