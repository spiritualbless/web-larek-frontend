# Веб-Ларёк

##  Описание проекта

Проект выполнен в парадигме **MVP (Model-View-Presenter)** с использованием **TypeScript, SCSS, Webpack**.

---

##  Стек технологий

* **HTML**
* **SCSS**
* **TypeScript**
* **Webpack**

---

##  Структура проекта

```bash
src/
│
├── components/          # UI-компоненты (View-слой)
│   ├── base/            # Базовые классы и интерфейсы (Form, Modal, Events и др.)
│   └── ...              # Все представления: Card, CartView, Page, Header и т.д.
│
├── models/              # Слой данных: Cart, Order, Contacts, CardsCatalog
├── types/               # Все интерфейсы и типы
├── utils/               # Утилиты: функции и константы
├── pages/
│   └── index.html       # Главная страница
│
├── index.ts             # Точка входа (презентер)
└── scss/
    └── styles.scss      # Главный SCSS-файл
```

---

##  Установка и запуск

### Установка зависимостей

```bash
npm install
# или
yarn
```

### Запуск проекта в dev-режиме

```bash
npm run start
# или
yarn start
```

### Сборка проекта

```bash
npm run build
# или
yarn build
```

---

##  Архитектура (MVP)

**MVP** разделяет проект на:

* **Модель (Model)** — бизнес-логика, хранение состояния
* **Представление (View)** — интерфейс, отображение данных
* **Презентер** — посредник, обрабатывает события и координирует модель и представление

---

##  Базовая инфраструктура

### `Api`

Обёртка для HTTP-запросов.
Методы:

* `get(endpoint: string): Promise<T>`
* `post(endpoint: string, data: any): Promise<T>`

### `EventEmitter`

Собственная реализация PubSub-механизма.
Методы:

* `emit(event: string, payload?: any)`
* `on(event: string, handler: Function)`
* `off(event: string, handler: Function)`
* `trigger(event: string) => Function` — возвращает коллбек, автоматически вызывающий `emit`

---

##  Модель (Model)

### `CardsCatalog`

Управляет товарами.

```ts
products: IProduct[];

setItems(items: IProduct[]): void;
getItem(id: string): IProduct;
```

---

### `Cart`

Корзина товаров.

```ts
items: IProduct[];

add(item: IProduct): void;
delete(id: string): void;
clearCart(): void;
getTotalPrice(): number;
```

---

### `Order`

Состояние заказа.

```ts
payment: string;
address: string;
setField({ field, value }): void;
checkValidation(): void;
clearData(): void;
```

---

### `Contacts`

Контактные данные.

```ts
email: string;
phone: string;
setField({ field, value }): void;
checkValidation(): void;
clearData(): void;
```

---

##  Представление (View)

### `Card`

Карта товара в каталоге.

```ts
render(product: IProduct): HTMLElement
```

---

### `CardPreview`

Превью карточки (в модалке).

```ts
render(product: IProduct): HTMLElement
```

---

### `StoreCard`

Карточка в корзине.

```ts
index: number;
render(product: IProduct): HTMLElement
```

---

### `CartView`

Корзина.

```ts
render({ content: HTMLElement[], price: number }): HTMLElement
```

---

### `OrderForm`, `ContactsForm`

Формы заказа и контактов. Наследуются от `Form`.

Методы:

```ts
render(): HTMLElement
clearInputs(): void
disableButtons(): void
```

---

### `Modal`

Модальное окно.

```ts
content: HTMLElement;

render(): HTMLElement
closeModal(): void
```

---

### `SuccessModal`

Финальная модалка успешной покупки.

```ts
render({ price: number }): HTMLElement
```

---

### `Header`

Шапка страницы с кнопкой корзины.

```ts
counter: number;

render(): HTMLElement
```

---

### `Page`

Контейнер страницы.

```ts
locked: boolean;
header: HTMLElement;
catalog: HTMLElement;
```

---

##  Взаимодействие компонентов (Presenter)

Настраивается в `src/index.ts`. Подписки и обработка событий через `EventEmitter`.

### Основные события

| Событие                | Значение                                                     |
| ---------------------- | ------------------------------------------------------------ |
| `cards:changed`        | Товары загружены, отрисовать каталог                         |
| `card:select`          | Открыть модалку с описанием товара                           |
| `card:toCart`          | Добавить товар в корзину и закрыть модалку                   |
| `cart:open`            | Открыть корзину                                              |
| `cart:delete`          | Удалить товар из корзины                                     |
| `cart:changed`         | Обновить отображение корзины и цену                          |
| `cart:order`           | Открыть форму заказа                                         |
| `orderInput:change`    | Пользователь вводит адрес или способ оплаты                  |
| `contactsInput:change` | Пользователь вводит email или телефон                        |
| `order:submit`         | Перейти к форме контактов                                    |
| `contacts:submit`      | Завершить заказ, отправить на сервер                         |
| `modal:close`          | Закрыть текущее модальное окно                               |
| `order:success`        | Заказ завершён — сбросить данные и открыть финальную модалку |

---

##  Функциональность

* Каталог товаров (данные с сервера)
* Модальные окна
* Корзина с подсчётом суммы
* Пошаговое оформление заказа
* Валидация форм
* Уведомление об успешной покупке

---

##  Завершение заказа

После успешной покупки:

* очищается корзина
* очищаются поля форм
* отображается финальное модальное окно
* при клике по "За новыми покупками!" пользователь возвращается к каталогу

