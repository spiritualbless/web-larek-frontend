# Проект: Web Larek Frontend

## Краткое описание проекта

Клиентская часть веб-приложения, реализованная на языке TypeScript, с использованием шаблонов и событийной модели.
Приложение реализует функциональность интернет-магазина: загрузка данных с сервера, отображение товаров, управление корзиной, оформление заказа и подтверждение успешной покупки. Архитектура приложения ориентирована на разделение ответственности между слоями.
Пользователи могут просматривать товары, добавлять их в корзину, оформлять заказ с выбором способа оплаты и вводом контактных данных. После оформления заказа отображается сообщение об успешной покупке.

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


##  Структура проекта

```
src/
├── components/
│   ├── base/         # API, EventEmitter
│   ├── model/        # Cart, Order, Contacts, Catalog
│   ├── services/     # webLarekApi
│   ├── view/         # Card, CartView, Header, Modal, Page
│   ├── common/       # Form
├── types/            # Интерфейсы и типы
├── utils/            # Константы
├── pages/            # HTML-шаблоны
├── scss/             # Стили
└── index.ts          # Главный файл — презентер
```

---

## Архитектура проекта

Приложение реализовано по паттерну **MVP (Model-View-Presenter)**:

* **Model** — хранит и обрабатывает данные (`Cart`, `Order`, `Contacts`, `CardsCatalog`)
* **View** — отвечает за отрисовку интерфейса (`Card`, `CartView`, `OrderForm`, `ContactsForm`, `Modal`, `Page`, `Header`)
* **Presenter** — `index.ts`, соединяет слои, реализует бизнес-логику и событийную маршрутизацию

Все взаимодействия происходят через **событийный брокер `EventEmitter`**.

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

## Базовый код (`src/components/base/`)

### `class EventEmitter implements IEvents`

Класс реализует шаблон "наблюдатель" (Observer) и используется в качестве централизованного механизма передачи событий между компонентами модели и представления.
Файл: `components/base/events.ts`

#### Свойства:

```ts
_events: Map<EventName, Set<Subscriber>>;
```

#### Методы:

```ts
on<T>(eventName: string, callback: (event: T) => void): void
off(eventName: string, callback: Subscriber): void
emit<T>(eventName: string, data?: T): void
onAll(callback: (event: EmitterEvent) => void): void
offAll(): void
trigger<T>(eventName: string, context?: Partial<T>): (data: T) => void
```

---

### `abstract class Component<T>`

Базовый UI-компонент
Файл: `components/base/component.ts`

#### Методы:

```ts
setState(state: Partial<T>): void
```

---

## MODEL

### `class Cart`

Хранит список товаров и управляет корзиной

```ts
add(product: IProduct): void
delete(id: string): void
clearCart(): void
getTotalPrice(): number
```

---

### `class Order`

Хранит данные заказа

```ts
setField<K extends keyof IOrder>(field: K, value: IOrder[K]): void
clearData(): void
```

---

### `class Contacts`

Хранит контактную информацию

```ts
setField<K extends keyof IContactsForm>(field: K, value: IContactsForm[K]): void
clearData(): void
```

---

### `class CardsCatalog`

Хранит список продуктов

```ts
setItems(items: IProduct[]): void
```

---

## VIEW

Наследники `Component<T>` — отвечают за отображение пользовательского интерфейса.

### `Card`, `StoreCard`, `CardPreview`

Компоненты для визуализации карточек товара (в каталоге, в корзине, в предпросмотре)

```ts
render(product: IProduct): HTMLElement
```

---

### `CartView`

Компонент отображения содержимого корзины

```ts
render({ content: HTMLElement[], price: number }): HTMLElement
```

---

### `OrderForm`, `ContactsForm`

Формы заказа и ввода контактных данных

```ts
render(): HTMLElement
clearInputs(): void
disableButtons(): void
```

---

### `Modal`

Один универсальный модальный компонент

```ts
set content(value: HTMLElement): void
render(): HTMLElement
showModal(): void
closeModal(): void
showSuccess(price: number, template: HTMLTemplateElement): void
```

---

## PRESENTER

Файл `index.ts` выступает в роли Presenter.

* Инициализирует модели, представления и API
* Реагирует на события от `EventEmitter`
* Управляет отображением, переходами и логикой оформления заказа
* Служит точкой интеграции всех компонентов

---

## Список событий в приложении

### События VIEW

* `card:select` — клик по карточке товара
* `card:toCart` — добавить товар в корзину
* `cart:open` — открыть корзину
* `cart:delete` — удалить товар из корзины
* `cart:order` — перейти к оформлению
* `modal:close` — закрытие модального окна

---

### События MODEL

* `cards:changed` — обновление списка карточек
* `cart:changed` — изменение состава корзины
* `orderInput:change` — ввод данных в форму заказа
* `orderErrors:change` — ошибки валидации заказа
* `contactsInput:change` — ввод данных в форму контактов
* `contactsErrors:change` — ошибки валидации контактов
* `order:submit` — подтверждение заказа
* `contacts:submit` — подтверждение контактов
* `order:success` — завершение заказа, успех

---

## Сервисы

### `class WebLarekApi extends Api`

Обёртка над API. Используется для получения и отправки данных с сервера.

```ts
getProducts(): Promise<IProduct[]>
order(data: IOrder & IContactsForm): Promise<ISuccess>
```

---

### `class Api`

Базовый HTTP-клиент.

```ts
get<T>(uri: string): Promise<T>
post<T>(uri: string, data?: object): Promise<T>
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


