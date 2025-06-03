export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
  id: string;
  index?: number;
  title: string;
  description?: string;
  image?: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}

export interface IView {
	render(data?: object): HTMLElement;
}

export interface ICart {
	items: IProduct[];
	add(item: IProduct): void;
	delete(id: string): void;
	clearCart(): void;
	getTotalPrice(): number;
}

export interface ICardsCatalog {
products: IProduct[];

  setItems(items: IProduct[]): void;
  getItem(id: string): IProduct | undefined;
}


export interface IAction {
	onClick: (event: MouseEvent) => void;
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IOrder {
	payment: string;
	address: string;
}

export interface ISuccess {
  id: string;
  total: number;
}

export interface IFormState<T> {
	valid: boolean;
	errors: T
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface ApiListResponse<T> {
  items: T[];
}


export interface IModal {
	content: HTMLElement;

	showModal(): void;
	closeModal(): void;
}

export interface IHeader {
	counter: number;
	cartButton: HTMLButtonElement;
}

export interface IPage {
	header: HTMLElement;
	catalog: HTMLElement[];
	locked: boolean;
}