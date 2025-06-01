import { IProduct, ICart } from '../../types';
import { IEvents } from '../base/events';

export class Cart {
	public items: IProduct[] = [];

	constructor(protected events: IEvents) {
		this.items = []; 
	}

	add(item: IProduct) {
		this.items.push(item);
		this.events.emit('cart:changed', this.items);
	}

	delete(id: string) {
		this.items = this.items.filter(item => item.id !== id);
		this.events.emit('cart:changed', this.items);
	}

	clearCart() {
		this.items = [];
		this.events.emit('cart:changed', this.items);
	}

	getTotalPrice(): number {
		return this.items.reduce((sum, item) => sum + item.price, 0);
	}
}

