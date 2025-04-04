import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/config';
import { IOrderResult, IProduct, OrderForm } from './types';
import './scss/styles.scss';
import { Modal } from './components/common/Modal';
import { FormHandler } from './components/common/FormHandler';
import { Cart } from './components/common/Cart';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekApi';
import { Success } from './components/Success';
import { Page } from './components/Page';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { ProductCard } from './components/ProductCard';
import { AppState } from './components/AppState';


const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, infoPayload }) => {
	console.log(eventName, infoPayload);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modalTemplate = ensureElement<HTMLElement>('#modal-container');
// Модель данных приложения
const appData = new AppState(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Cart(events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

api
	.getProductList()
	.then(appData.setItems.bind(appData))
	.catch((err) => console.log(err));

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('card:select', (productItem: IProduct) => {
	appData.setPreview(productItem);
});

events.on('items:change', (items: IProduct[]) => {
	page.catalog = items.map((productItem) => {
		const card = new ProductCard(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', productItem),
		});
		return card.render(productItem);
	});
});

events.on('preview:change', (productItem: IProduct) => {
	const card = new ProductCard(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (appData.inBasket(productItem)) {
				appData.removeFromBasket(productItem);
				card.button = 'В корзину';
			} else {
				appData.addToBasket(productItem);
				card.button = 'Удалить из корзины';
			}
		},
	});

	card.button = appData.inBasket(productItem) ? 'Удалить из корзины' : 'В корзину';
	modal.render({
		content: card.render(productItem),
	});
	modal.open();
});

events.on('basket:change', () => {
	page.counter = appData.basket.items.length;

	basket.items = appData.basket.items.map((id) => {
		const productItem = appData.items.find((productItem) => productItem.id === id);
		const card = new ProductCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeFromBasket(productItem),
		});
		return card.render(productItem);
	});

	basket.total = appData.basket.total;
});

events.on('basket:open', () => {
	modal.render({ content: basket.render() });
	modal.open();
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	modal.open();
});

events.on(
	/^order\..*:change/,
	(infoPayload: { field: keyof OrderForm; value: string }) => {
		appData.setOrderField(infoPayload.field, infoPayload.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(infoPayload: { field: keyof OrderForm; value: string }) => {
		appData.setOrderField(infoPayload.field, infoPayload.value);
	}
);

events.on('formErrors:change', (errors: Partial<OrderForm>) => {
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	contacts.valid = !email && !phone;
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			appData.clearBasket();
			events.emit('basket:change');
			modal.render({
				content: success.render({ total: appData.order.total }),
			});
			modal.open();
		})
		.catch((err) => {
			console.error(err);
		});
});
