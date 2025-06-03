# Веб-Ларёк

##  Описание

**Веб-Ларёк** — это фронтенд-приложение интернет-магазина, реализованное на TypeScript с использованием архитектурного паттерна **MVP**. В проекте используется событийная архитектура, что обеспечивает слабую связанность между компонентами, масштабируемость и поддержку SRP (принцип единственной ответственности).

---

##  Используемый стек

* TypeScript
* HTML, SCSS
* Webpack
* Event-driven архитектура
* Паттерн MVP
* Модули ES6

---

##  Установка и запуск

```bash
npm install    # установка зависимостей
npm run start  # запуск проекта в dev-режиме
```

---

##  Архитектура

Проект организован по паттерну **MVP**:

* **Model** — бизнес-логика (корзина, заказ, контакты, каталог)
* **View** — представление интерфейса (карточки, корзина, формы, модалки)
* **Presenter (index.ts)** — связывает модель и представление через события

Все взаимодействия происходят через **событийный брокер `EventEmitter`**.

---

##  Структура проекта

```
src/
├── components/
│   ├── base/         # API, EventEmitter, базовые абстракции
│   ├── model/        # Cart, Order, Contacts, Catalog
│   ├── view/         # Card, CartView, Header, Modal, Page, SuccessModal
│   ├── common/       # Form
├── types/            # Интерфейсы и типы
├── utils/            # Константы
├── pages/            # HTML-шаблоны
├── scss/             # Стили
└── index.ts          # Главный файл — презентер
```

---

##  Классы и компоненты

###  EventEmitter

Файл: `components/base/events.ts`
Класс: `EventEmitter`

* Брокер событий, реализует подписку и вызов событий
* Методы: `on`, `emit`, `off`, `trigger`

---

###  WebLarekApi

Файл: `components/base/weblarekapi.ts`
Класс: `WebLarekApi extends Api`

* Методы:

  * `getProducs()` — загрузка товаров, подстановка CDN
* Поля: `cdn`

---

###  Card-компоненты

Файлы:

* `view/card.ts`: `Card`, `StoreCard`, `CardPreview`
* Наследуют `BaseCard`

Методы:

* `render()`
* `constructor()`

Поля:

* `template`, `button`, `description`, `product`, `actions`, `events`

---

###  CartView

Файл: `view/cart.ts`
Класс: `CartView`

* Отображает список товаров в корзине
* Слушает события удаления и обновления
* Методы: `render()`

---

###  Modal

Файл: `view/modal.ts`
Классы: `Modal`, `SuccessModal`

* `Modal`:

  * Методы: `showModal()`, `closeModal()`, `render()`
  * Поля: `_content`, `_closeButton`, `container`, `events`
* `SuccessModal`:

  * Показывает информацию о заказе
  * Поля: `price`, `template`

---

###  OrderForm, ContactsForm

Файлы: `view/order.ts`, `view/contacts.ts`
Классы:

* `OrderForm`: для выбора оплаты и адреса
* `ContactsForm`: email и телефон

Методы:

* `render()`
* Обработка input-событий

---

###  Header

Файл: `view/header.ts`
Класс: `Header implements IHeader`

* Поля: `_counter`, `_cartButton`
* Методы: `render()`, `set counter()`

---

###  Page

Файл: `view/page.ts`
Класс: `Page implements IPage`

* Поля: `header`, `catalog`, `locked`
* Методы: `setCatalog(items)`, `setLocked()`, `render()`

---

##  Модели (Model)

###  Cart

Файл: `model/cart.ts`
Класс: `Cart implements ICart`

* Методы:

  * `add(item)`, `delete(id)`, `clearCart()`, `getTotalPrice()`
* Поля: `items`

---

###  CardsCatalog

Файл: `model/cards.ts`
Класс: `CardsCatalog implements ICardsCatalog`

* Методы: `setItems`, `getItem`

---

###  Contacts

Файл: `model/contacts.ts`
Класс: `Contacts implements IContactsForm`

* Поля: `email`, `phone`
* Методы: `validate()`

---

###  Order

Файл: `model/order.ts`
Класс: `Order implements IOrder`

* Поля: `payment`, `address`
* Методы: `validate()`

---

##  Типы и интерфейсы

**Из файла `types/index.ts`**

```ts
type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

interface IProduct {
  id: string;
  index?: number;
  title: string;
  description?: string;
  image?: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}

interface ICart {
  items: IProduct[];
  add(item: IProduct): void;
  delete(id: string): void;
  clearCart(): void;
  getTotalPrice(): number;
}

interface ICardsCatalog {
  products: IProduct[];
  setItems(items: IProduct[]): void;
  getItem(id: string): IProduct | undefined;
}

interface IContactsForm {
  email: string;
  phone: string;
}

interface IOrder {
  payment: string;
  address: string;
}

interface ISuccess {
  id: string;
  total: number;
}

interface IFormState<T> {
  valid: boolean;
  errors: T;
}

interface ApiListResponse<T> {
  items: T[];
}

interface IModal {
  content: HTMLElement;
  showModal(): void;
  closeModal(): void;
}

interface IHeader {
  counter: number;
  cartButton: HTMLButtonElement;
}

interface IPage {
  header: HTMLElement;
  catalog: HTMLElement[];
  locked: boolean;
}

interface IView {
  render(data?: object): HTMLElement;
}

interface IEvents {
  on<T>(event: string, callback: (data: T) => void): void;
  emit<T>(event: string, data?: T): void;
  trigger<T>(event: string, context?: Partial<T>): (data: T) => void;
}
```

---

##  Процесс взаимодействия

1. **View** инициирует событие через `EventEmitter`
2. **Presenter** ловит событие и вызывает методы модели
3. **Model** обновляет данные
4. Событие `model:changed` запускает обновление соответствующего **View**

---

##  Принципы проектирования

* **Модульность**: каждый компонент изолирован
* **SRP**: все классы делают одну вещь
* **Расширяемость**: добавление новых сущностей не ломает старые
* **Событийная архитектура**: позволяет компоновать и масштабировать поведение


