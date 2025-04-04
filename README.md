#  Проектная работа «Web Larek»

**Стек:** `HTML`, `SCSS`, `TypeScript`, `Webpack`

---

##  Структура проекта

```
src/
├── components/
│   ├── AppState.ts          — состояние приложения
│   ├── ProductCard.ts       — карточка товара
│   ├── Order.ts             — оформление заказа
│   ├── Contacts.ts          — контактная информация
│   ├── Page.ts              — главный интерфейс
│   ├── Success.ts           — успех заказа
│   ├── WebLarekApi.ts       — клиент API
│   ├── base/
│   │   ├── Component.ts     — базовый компонент
│   │   ├── api.ts           — абстракция API
│   │   └── events.ts        — EventEmitter
│   └── common/
│       ├── Cart.ts          — корзина
│       ├── FormHandler.ts   — форма и валидация
│       └── Modal.ts         — модальные окна
├── types/index.ts           — интерфейсы данных
├── utils/config.ts          — константы
├── utils/utils.ts           — вспомогательные функции
├── pages/index.html         — HTML-шаблон
└── index.ts                 — точка входа
```

---

##  Установка и запуск

```bash
npm install
npm run start
# или
yarn
yarn start
```

---

##  Сборка проекта

```bash
npm run build
# или
yarn build
```

---

##  Интерфейсы данных

Из `types/index.ts`:
- `IProduct` — товар из каталога
- `IBasket` — содержимое корзины
- `IOrder` — данные заказа
- `IOrderResult` — результат оформления

Из компонентов:
- `ICardActions` — действия карточки
- `IWebLarekAPI` — методы API-клиента
- `IModalData` — модальное окно
- `IFormState` — состояние формы
- `IPage` — состояние страницы
- `ISuccessActions` — данные успешной оплаты
- `IEvents` — интерфейс событийного брокера

---

##  Основные классы

### `AppState.ts`
Хранилище данных приложения. Содержит:
- Список товаров
- Выбранный товар
- Корзину
- Данные формы и способ оплаты

---

### `WebLarekApi.ts`
Работает с сервером: получает список товаров, отправляет заказ.

Методы:
- `getProductList()`
- `getProductItem(id)`
- `orderProducts(data)`

---

### `ProductCard.ts`
Рендерит карточку товара (`Component<IProduct>`), обрабатывает клик по кнопке.

---

### `Cart.ts`
Управляет корзиной (`View<IBasket>`): добавление, удаление, расчёт итогов.

---

### `FormHandler.ts`
Валидация форм (контакты, заказ), отслеживание изменений (`View<IFormState>`).

---

### `Modal.ts`
Компонент модального окна. Методы:
- `open(content)`
- `close()`
- `setContent()`

---

### `Page.ts`
Главный визуальный интерфейс. Показывает каталог, корзину, модалки, ошибки и успех.

---

### `Order.ts` / `Contacts.ts`
Работают с формами ввода: email, телефон, адрес и способ оплаты.

---

### `Success.ts`
Показывает успешную оплату заказа (`Component<IOrderResult>`)

---

### `Component.ts` / `View.ts`
Базовые абстракции компонентов. Позволяют:
- Изменять DOM
- Обновлять состояния
- Навешивать события

---

### `events.ts`
Событийный брокер (`EventEmitter`) для связи компонентов. Методы:
- `on(event, handler)`
- `emit(event, data)`
- `off(event, handler)`

---

##  События приложения

- `modal:open`, `modal:close`
- `card:select`
- `items:change`
- `preview:change`
- `cart:change`, `cart:open`
- `order:submit`, `contacts:submit`
- `formErrors:change`
