#  **Веб-ларёк — документация проекта**


##  **Архитектура проекта**

* **Model** — бизнес-логика и управление данными: `Cart`, `Catalog`, `AppState`
* **View** — компоненты отображения, унаследованные от `Component<T>`
* **Presenter** — связующая логика в `index.ts`
* **EventEmitter** — независимый связующий механизм

---

##  **Типы данных (`src/types/index.ts`)**

```ts
export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export type PaymentMethod = 'card' | 'cash';

export interface OrderForm {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

export interface OrderData extends OrderForm {
  items: string[];
  formErrors: Record<string, string>;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
}

export interface AppState {
  catalog: Product[];
  cart: CartItem[];
  order: Partial<OrderData>;
  preview: Product | null;

  isProductInCart(id: string): boolean;
  getCartIds(): string[];
  getCartLength(): number;
  getTotal(): number;
  clearCart(): void;
  initOrder(): OrderData;
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

## ⚙️ **Константы (`constants.ts`)**

```ts
export const CATEGORY_NAMES: Record<string, string>
export const FORM_ERRORS: Record<string, string>
export enum Events { ... }
```

Все **магические строки** и категории вынесены в `constants.ts`.

---

##  **Presenter — `index.ts`**

* Создаёт все модели и компоненты
* Связывает слои через `EventEmitter`
* Подписывает события и вызывает `render()`

---

## Ключевые типы данных

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