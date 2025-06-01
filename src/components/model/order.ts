import { IOrder, IFormState } from '../../types';
import { IEvents } from '../base/events';
import { constraintsOrder } from '../../utils/constants';
import * as yup from 'yup';

export class Order {
	public valid: boolean = false;
	public errors: Partial<IOrder> = { payment: '', address: '' };
	private _data: IOrder = { payment: '', address: '' };

	private schema = yup.object({
		payment: yup
			.string()
			.oneOf(['card', 'cash'], 'Выберите способ оплаты')
			.required('Оплата обязательна'),
		address: yup
			.string()
			.min(5, 'Адрес слишком короткий')
			.required('Адрес обязателен'),
	});

	constructor(protected events: IEvents) {}

	setField({ field, value }: { field: keyof IOrder; value: string }) {
		this._data[field] = value;
		this.validate();
	}

	private validate(): void {
		try {
			this.schema.validateSync(this._data, { abortEarly: false });
			this.errors = { payment: '', address: '' };
			this.valid = true;
		} catch (e) {
			if (e instanceof yup.ValidationError) {
				this.errors = { payment: '', address: '' };
				for (const err of e.inner) {
					if (err.path) {
						this.errors[err.path as keyof IOrder] = err.message;
					}
				}
			}
			this.valid = false;
		}

		this.events.emit('orderErrors:change', this.errors);
	}

	clearData(): void {
		this._data = { payment: '', address: '' };
		this.errors = { payment: '', address: '' };
		this.valid = false;
	}

	get payment(): string {
		return this._data.payment;
	}

	get address(): string {
		return this._data.address;
	}
}

