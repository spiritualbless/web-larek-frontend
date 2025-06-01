import { IContactsForm } from '../../types';
import { IEvents } from '../base/events';

import * as yup from 'yup';

export class Contacts {
  public valid: boolean = false;
  public errors: Partial<IContactsForm> = { email: '', phone: '' };
  private _data: IContactsForm = { email: '', phone: '' };

 private schema = yup.object({
  email: yup
    .string()
    .email('Неверный email')
    .required('Email обязателен'),

  phone: yup
    .string()
    .required('Введите номер телефона.')
    .min(11, 'Номер телефона должен содержать 11 цифр.')
    .max(18, 'Номер телефона должен содержать 11 цифр.')
    .matches(
      /^(?:\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      'Номер телефона должен содержать 11 цифр.'
    ),
    });


  constructor(protected events: IEvents) {}

  setField({ field, value }: { field: keyof IContactsForm; value: string }) {
    this._data[field] = value;
    this.validate();
  }

  private validate(): void {
    try {
      this.schema.validateSync(this._data, { abortEarly: false });
      this.errors = { email: '', phone: '' };
      this.valid = true;
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        this.errors = { email: '', phone: '' };
        for (const err of e.inner) {
          if (err.path) {
            this.errors[err.path as keyof IContactsForm] = err.message;
          }
        }
      }
      this.valid = false;
    }

    this.events.emit('contactsErrors:change', this.errors);
  }

  clearData(): void {
    this._data = { email: '', phone: '' };
    this.errors = { email: '', phone: '' };
    this.valid = false;
  }

  get email(): string {
    return this._data.email;
  }

  get phone(): string {
    return this._data.phone;
  }
}

