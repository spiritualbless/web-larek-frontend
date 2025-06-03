import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export class Cart {
	private _items: IProduct[] = [];

	constructor(private events: IEvents) {}

	get items(): IProduct[] {
		return this._items;
	}

	add(item: IProduct): void {
		const exists = this._items.find(i => i.id === item.id);
		if (!exists) {
			item.selected = true;
			this._items.push(item);
			this.events.emit('cart:changed', this._items);
		}
	}

	delete(id: string): void {
		const index = this._items.findIndex(item => item.id === id);
		if (index > -1) {
			this._items[index].selected = false;
			this._items.splice(index, 1);
			this.events.emit('cart:changed', this._items);
		}
	}

	clearCart(): void {
		this._items.forEach(item => (item.selected = false));
		this._items = [];
		this.events.emit('cart:changed', this._items);
	}

	getTotalPrice(): number {
		return this._items.reduce((total, item) => total + (item.price ?? 0), 0);
	}
}


