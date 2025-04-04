import { IBasket, IOrder, IProduct, OrderForm, PaymentMethod } from '../types';
import { IEvents } from './base/events';

export class AppState {
	items: IProduct[] = [];
	basket: IBasket = {
		items: [],
		total: 0,
	};
	preview: IProduct = null;
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: 'card',
		total: 0,
		items: [],
	};

	formErrors: Partial<Record<keyof OrderForm, string>> = {};

	constructor(protected events: IEvents) {}

	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit('items:change', this.items);
	}

	setPreview(productItem: IProduct) {
		this.preview = productItem;
		this.events.emit('preview:change', productItem);
	}

	inBasket(productItem: IProduct) {
		return this.basket.items.includes(productItem.id);
	}

	addToBasket(productItem: IProduct) {
		this.basket.items.push(productItem.id);
		this.basket.total += productItem.price;
		this.events.emit('basket:change', this.basket);
	}

	removeFromBasket(productItem: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id != productItem.id);
		this.basket.total -= productItem.price;
		this.events.emit('basket:change', this.basket);
	}

	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:change');
	}

	setPaymentMethod(method: PaymentMethod) {
		this.order.payment = method;
	}

	setOrderField(field: keyof OrderForm, value: string) {
		if (field === 'payment') {
			this.setPaymentMethod(value as PaymentMethod);
		} else {
			this.order[field] = value;
		}

		if (this.order.payment && this.validateOrder()) {
			this.order.total = this.basket.total;
			this.order.items = this.basket.items;
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		const email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z0-9_-]+)/;

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!email_regex.test(this.order.email)) {
			errors.email = 'Необходимо указать корректный email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.phone = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
