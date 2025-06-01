import { IView, IProduct, IAction } from '../../types';
import { IEvents } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { CDN_URL, kinds } from '../../utils/constants';
import { handlePrice } from '../../utils/utils';

abstract class BaseCard implements IView {
	protected _content: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLSpanElement;
	protected _category?: HTMLSpanElement;

	constructor(template: HTMLTemplateElement) {
		this._content = cloneTemplate(template);
		this._title = this._content.querySelector('.card__title')!;
		this._image = this._content.querySelector('.card__image') ?? undefined;
		this._price = this._content.querySelector('.card__price')!;
		this._category = this._content.querySelector('.card__category') ?? undefined;
	}

	protected fillCommonFields(product: IProduct) {
		this._title.textContent = product.title;

		if (this._image) {
			this._image.src = CDN_URL + product.image;
			this._image.alt = product.title;
		}

		this._price.textContent =
			product.price == null
				? 'Бесценно'
				: `${handlePrice(String(product.price))} синапсов`;

		if (this._category) {
			this._category.className = `card__category card__category${kinds[product.category]}`;
			this._category.textContent = product.category;
		}
	}

	abstract render(product: IProduct): HTMLElement;
}

export class Card extends BaseCard {
	constructor(template: HTMLTemplateElement, protected events: IEvents, protected actions: IAction) {
		super(template);
		this._content.addEventListener('click', this.actions.onClick);
	}

	render(product: IProduct): HTMLElement {
		this.fillCommonFields(product);
		return this._content;
	}
}

export class CardPreview extends BaseCard {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected actions: IAction) {
		super(template);
		this._description = this._content.querySelector('.card__text')!;
		this._button = this._content.querySelector('.card__button')!;
		this._button.addEventListener('click', this.actions.onClick);
	}

	render(product: IProduct): HTMLElement {
		this.fillCommonFields(product);
		this._description.textContent = product.description;

		const isFree = product.price == null;
		const isInCart = product.selected;

		this._button.disabled = isFree || isInCart;
		this._button.textContent = isInCart
			? 'Товар уже в корзине'
			: isFree
			? 'Недоступен'
			: 'В корзину';

		return this._content;
	}
}

export class StoreCard extends BaseCard {
	protected _index: HTMLSpanElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents, protected actions: IAction) {
		super(template);
		this._index = this._content.querySelector('.basket__item-index')!;
		this._deleteButton = this._content.querySelector('.basket__item-delete')!;
		this._deleteButton.addEventListener('click', this.actions.onClick);
	}

	set index(value: number) {
		this._index.textContent = String(value);
	}

	render(product: IProduct): HTMLElement {
		this.fillCommonFields(product);
		return this._content;
	}
}

