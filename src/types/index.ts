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