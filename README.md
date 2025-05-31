#  **Веб-ларёк — документация проекта**


##  **Архитектура проекта**

* **Model** — бизнес-логика и управление данными: `Cart`, `Catalog`, `AppState`
* **View** — компоненты отображения, унаследованные от `Component<T>`
* **Presenter** — связующая логика в `index.ts`
* **EventEmitter** — независимый связующий механизм

---

## Типы данных (`src/types/index.ts`)

```ts
export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}

export interface IOrderForm {
  payment: 'card' | 'cash';
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
  total: number | string;
  items: string[];
}

export interface ISuccess {
  id: string;
  total: number;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type ApiListResponse<T> = {
  total: number;
  items: T[];
};

export interface IAppState {
  basket: IProduct[];
  store: IProduct[];
  order: IOrder;
  formErrors: Partial<Record<keyof IOrderForm | keyof IContactsForm, string>>;
  setCatalog(items: IProduct[]): void;
  addToBasket(item: IProduct): void;
  removeFromBasket(itemId: string): void;
  clearBasket(): void;
  getTotal(): number;
  setOrderField(field: keyof IOrderForm, value: string): void;
  validateOrder(): boolean;
  setContactsField(field: keyof IContactsForm, value: string): void;
  validateContacts(): boolean;
}
```

---

##  **Базовый код**

### **`Component<T>` — базовый класс для View**

Методы:

* `render(data?: Partial<T>): HTMLElement`
* `toggleClass()`, `setText()`, `setDisabled()`, `setImage()` и др.

---

### **`EventEmitter` — реализация паттерна "Наблюдатель"**

Методы:

```ts
on<T>(event: string, cb: (data: T) => void): void
off(event: string, cb: Function): void
emit<T>(event: string, data?: T): void
onAll(cb: (e: { eventName: string; data?: unknown }) => void): void
offAll(): void
```

---

##  **MODEL**

### **`Cart`**

```ts
add(product: Product): void
remove(productId: string): void
has(productId: string): boolean
getAll(): CartItem[]
clear(): void
```

### **`Catalog`**

```ts
loadProducts(): Promise<void>
getAll(): Product[]
```

---

##  **VIEW (устройства отображения)**

### Пример: **`ProductCard extends Component<Product>`**

```ts
render(data: Product): HTMLElement
```

Использует данные типа `Product`, отображает карточку товара, генерирует событие `product:open` при клике.

---

##  **AppState — единая модель состояния**

Комбинирует все данные приложения. Подписан на `EventEmitter`.

Методы:

```ts
isProductInCart(id: string): boolean
getCartIds(): string[]
getCartLength(): number
getTotal(): number
clearCart(): void
initOrder(): OrderData
```

---

##  **Модальное окно `Modal`**

**Одиночный компонент**, не имеет наследников.

Методы:

```ts
open(content: HTMLElement): void
close(): void
```

---

##  **Список событий**

### **MODEL:**

* `catalog:changed` — загрузка товаров
* `cart:changed` — изменение корзины
* `order:validation`, `order:submit`, `order:complete`

### **VIEW:**

* `product:open`
* `cart:open`
* `order:open`
* `contacts:submit`
* `modal:open`, `modal:close`
* `email:change`, `phone:change`, `payment:change`, `address:change`

---

##  **WebLarekApi — сервисный класс**

Методы:

```ts
getProducts(): Promise<Product[]>
submitOrder(order: OrderData): Promise<void>
```

---

##  **Константы (`constants.ts`)**

```ts
export const CATEGORY_NAMES: Record<string, string>
export const FORM_ERRORS: Record<string, string>
export enum Events { ... }
```

---

##  **Presenter — `index.ts`**

* Создаёт все модели и компоненты
* Связывает слои через `EventEmitter`
* Подписывает события и вызывает `render()`

---

## Ключевые типы данных

```ts
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