# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


Приложение реализовано по MVP архитектуре и состоит из следующих компонентов:


Model

Описание: Модель данных
Базовый класс: DataModel
Связанные классы: AppData, ProductItem, OrderData


View

Описание: Модель отображения
Базовый класс: ViewComponent
Связанные классы: MainPage, ModalWindow, Cart, ProductCard, CartItem, BaseForm, PaymentForm, ContactForm, OrderSuccess


Presenter

Описание: Логика связи
Базовый класс: -
Связанные классы: Реализуется в index.ts


Событийно-ориентированный подход

Реализован через кастомный класс EventManager для обработки событий.

---

### Базовый код

1. **Класс ApiClient**  
   Нативный класс для работы с API, использующий `fetch` для HTTP-запросов.  
   - Поддерживает безопасные (GET) и небезопасные (POST, DELETE) операции.  
   - Методы: `get`, `post`, `delete`.  
   - Конфигурация: Базовый URL задаётся в конструкторе, обработка JSON встроена.


2. **Класс ViewComponent**  
   Базовый класс для компонентов отображения. Использует нативный DOM API для управления элементами.  
   - Методы: `setText`, `toggleClass`, `setDisabled`, `render`.  


3. **Класс EventManager**  
   Реализует паттерн «Наблюдатель» для обработки событий.  
   - Методы: `on`, `off`, `emit`, `onAll`, `offAll`.  
   - Особенности: Хранит подписчиков в объекте, где ключ — имя события, значение — массив коллбэков.


4. **Класс DataModel**  
   Базовый класс для моделей данных. Связывает данные с объектом и уведомляет о изменениях через `EventManager`.  
   - Методы: `setData`, `emitChange`.  


---

### Компоненты модели данных (бизнес-логика)

1. **Класс AppData**  
   Хранит состояние приложения.  
   - Свойства:  
     - `catalog`: Список доступных продуктов (событие `catalog:changed`).  
     - `cart`: Продукты в корзине.  
     - `order`: Данные заказа.  
     - `preview`: Продукт для модального окна.  
   - Методы: `addToCart`, `removeFromCart`, `clearCart`, `getTotal`, `getCartIds`, `getCartLength`, `initOrder`.  

2. **Класс ProductItem**  
   Хранит данные одного продукта.  
   - Свойства: `id`, `title`, `description`, `image`, `category`, `price`, `isInCart`.  
   - Методы: `toggleInCart` (добавление/удаление из корзины, событие `product:changed`).  

3. **Класс OrderData**  
   Хранит данные заказа.  
   - Свойства: `payment`, `address`, `email`, `phone`, `items`, `formErrors`.  
   - Методы: `validateFields`, `clearOrder`, `submitOrder`.  
   - Особенности: Валидация вызывает событие `order:validation`.  

---

### Компоненты представления

1. **Класс MainPage**  
   Отображает главную страницу.  
   - Свойства:  
     - `cartCounter`: Количество товаров в корзине.  
     - `gallery`: Список карточек продуктов.  
     - `wrapper`: Контейнер для блокировки прокрутки.  
     - `cartButton`: Кнопка открытия корзины (событие `cart:open`).  

2. **Класс ModalWindow**  
   Модальное окно.  
   - Свойства:  
     - `content`: Внутреннее содержимое.  
     - `closeButton`: Кнопка закрытия (событие `modal:close`).  

3. **Класс Cart**  
   Отображает корзину.  
   - Свойства:  
     - `items`: Список элементов корзины.  
     - `total`: Общая стоимость.  
     - `orderButton`: Кнопка открытия формы заказа (событие `order:open`).  

4. **Класс ProductCard**  
   Карточка продукта.  
   - Свойства: `id`, `title`, `price`, `image`, `category`.  
   - События: Клик вызывает `product:open`.  

5. **Класс CartItem**  
   Элемент корзины.  
   - Свойства: `index`, `title`, `price`, `deleteButton`.  
   - События: Клик по кнопке удаления вызывает `product:remove`.  

6. **Класс BaseForm**  
   Базовая форма.  
   - Свойства:  
     - `submitButton`: Кнопка отправки.  
     - `errorBlock`: Блок ошибок.  
   - События: `input:change`, `form:submit`.  

7. **Класс PaymentForm**  
   Форма оплаты и адреса доставки.  
   - Свойства: `payment`, `address`.  
   - События: `payment:change`, `address:change`, `payment:submit`.  

8. **Класс ContactForm**  
   Форма контактной информации.  
   - Свойства: `email`, `phone`.  
   - События: `email:change`, `phone:change`, `contacts:submit`.  

9. **Класс OrderSuccess**  
   Отображает успешный заказ.  
   - Свойства: `total` (общая сумма).  

---

### Внешние связи

1. **Класс LarekApiClient**  
   Расширяет `ApiClient` для работы с API магазина.  
   - Методы:  
     - `getProduct`: Получение данных о продукте.  
     - `getProductList`: Получение списка продуктов.  
     - `submitOrder`: Отправка заказа.  

---

### Ключевые типы данных

```typescript
interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
    isInCart: boolean;
    addToCart: () => void;
    removeFromCart: () => void;
}

interface IOrder {
    payment: string;
    address: string;
    email: string;
    phone: string;
    items: IProduct[];
    formErrors: { [key: string]: string };
    validateFields: () => void;
    clearOrder: () => void;
    submitOrder: () => void;
}

interface IAppData {
    catalog: IProduct[];
    cart: IProduct[];
    order: IOrder;
    preview: IProduct | null;
    isProductInCart: (id: string) => boolean;
    clearCart: () => void;
    getTotal: () => number;
    getCartIds: () => string[];
    getCartLength: () => number;
    initOrder: () => IOrder;
}

enum Events {
    CATALOG_CHANGED = 'catalog:changed',
    PRODUCT_OPEN = 'product:open',
    CART_OPEN = 'cart:open',
    PRODUCT_CHANGED = 'product:changed',
    ORDER_VALIDATION = 'order:validation',
    ORDER_OPEN = 'order:open',
    ORDER_SUBMIT = 'order:submit',
    CONTACTS_OPEN = 'contacts:open',
    CONTACTS_SUBMIT = 'contacts:submit',
    ORDER_COMPLETE = 'order:complete',
    PAYMENT_CHANGED = 'payment:changed',
    ADDRESS_CHANGED = 'address:change',
    EMAIL_CHANGED = 'email:change',
    PHONE_CHANGED = 'phone:change',
    MODAL_OPEN = 'modal:open',
    MODAL_CLOSE = 'modal:close',
}
```
