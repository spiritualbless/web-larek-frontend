import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { WebLarekApi } from './components/services/webLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Page, Header } from './components/view/page';
import { Cart } from './components/model/cart';
import { CartView } from './components/view/cart';
import { CardsCatalog } from './components/model/cards';
import { Card, StoreCard, CardPreview } from './components/view/card';
import { Modal } from './components/view/modal';
import { OrderForm } from './components/view/order';
import { ContactsForm } from './components/view/contacts';
import { ApiListResponse, IContactsForm, IOrder, IProduct } from './types';
import { Order } from './components/model/order';
import { Contacts } from './components/model/contacts';

// Шаблоны карточек
const catalogCardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

// Шаблоны форм и модальных окон
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Контейнеры
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;
const pageRoot = document.body as HTMLElement;

// Основные объекты
const api = new WebLarekApi(API_URL, CDN_URL);
const events = new EventEmitter();

const cart = new Cart(events);
const catalog = new CardsCatalog(events);
const orderState = new Order(events);
const contactsState = new Contacts(events);

// Интерфейсы (UI)
const header = new Header(headerContainer, events);
const page = new Page(pageRoot, events);
const cartUI = new CartView(basketTemplate, events);
const modal = new Modal(modalContainer, events);
const orderForm = new OrderForm(orderTemplate, events);
const contactsForm = new ContactsForm(contactsTemplate, events);

// Загрузка данных
api
  .getProducts()
  .then((products: IProduct[]) => {
    catalog.setItems(products);
  })
  .catch(console.error);

// Обновление каталога
events.on('cards:changed', handleCatalogUpdate);

function handleCatalogUpdate(products: IProduct[]) {
	page.catalog = products.map(createCatalogCard);
	page.header = header.render();
}

function createCatalogCard(product: IProduct): HTMLElement {
	const card = new Card(catalogCardTemplate, events, {
		onClick: () => events.emit('card:select', product)
	});
	return card.render(product);
}

// ✅ Открытие модального окна при выборе карточки
events.on('card:select', (product: IProduct) => {
	const cardPreview = new CardPreview(previewCardTemplate, {
		onClick: () => events.emit('card:toCart', product)
	}).render(product);

	modal.content = cardPreview;
	modal.render();
	page.locked = true;
});

// Закрытие модального окна
events.on('modal:close', () => {
	page.locked = false;
});

// Добавление товара в корзину
events.on('card:toCart', (item: IProduct) => {
	cart.add(item);
	header.counter = cart.items.length;
	modal.closeModal();
});

// Открытие корзины
events.on('cart:open', () => {
	const items = cart.items;
	const cards = createCartCards(items);
	const total = cart.getTotalPrice();

	modal.content = cartUI.render({ content: cards, price: total });
	modal.render();
});

function createCartCards(items: IProduct[] = []): HTMLElement[] {
	return items.map((item, index) => {
		const card = new StoreCard(basketCardTemplate, events, {
			onClick: () => events.emit('cart:delete', item)
		});
		card.index = index + 1;
		return card.render(item);
	});
}


// Удаление из корзины
events.on('cart:delete', (item: IProduct) => {
	cart.delete(item.id);
});

// Обновление корзины
events.on('cart:changed', (items: IProduct[]) => {
	const cards = createCartCards(items);
	const total = cart.getTotalPrice();

	modal.content = cartUI.render({ content: cards, price: total });
});

// Переход к оформлению заказа
events.on('cart:order', () => {
	modal.closeModal();
	modal.content = orderForm.render();
	modal.render();
});

// Обработка ошибок формы заказа
events.on('orderErrors:change', (errors: Partial<IOrder>) => {
	const messages = Object.values(errors).filter(Boolean);
	orderForm.valid = messages.length === 0;
	orderForm.errors = messages.join('\n');
});

events.on('orderInput:change', orderState.setField.bind(orderState));

// Переход к форме контактов
events.on('order:submit', () => {
	modal.content = contactsForm.render();
	modal.render();
});

// Обработка ошибок формы контактов
events.on('contactsErrors:change', (errors: Partial<IContactsForm>) => {
	const messages = Object.values(errors).filter(Boolean);
	contactsForm.valid = messages.length === 0;
	contactsForm.errors = messages.join('\n');
});

events.on('contactsInput:change', contactsState.setField.bind(contactsState));

// Финальная отправка заказа
events.on('contacts:submit', () => {
api
  .order({
    payment: orderState.payment,
    total: cart.getTotalPrice(),
    address: orderState.address,
    email: contactsState.email,
    phone: contactsState.phone,
    items: cart.items.map(item => item.id), 
  } as IOrder & { items: string[] }) 

		.then((response) => {
			cart.clearCart();
			orderForm.clearInputs();
			orderForm.disableButtons();
			orderState.clearData();

			contactsForm.clearInputs();
			contactsForm.disableSubmitButton();
			contactsState.clearData();

			header.counter = 0;

			modal.showSuccess(response.total, successTemplate);
		})
		.catch(console.error);
});


events.on('order:success', () => {
	modal.closeModal();
});
