import { IProduct, ICardsCatalog } from '../../types';
import { IEvents } from '../base/events';

export class CardsCatalog implements ICardsCatalog {
products: IProduct[] = [];

  constructor(private events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.products = items;
    this.events.emit('cards:changed', this.products);
  }

	getItem(id: string): IProduct {
		for (let i = 0; i < this.products.length; i++) {
			if (this.products[i].id === id) {
				return this.products[i];
			}
		}
	}
}



