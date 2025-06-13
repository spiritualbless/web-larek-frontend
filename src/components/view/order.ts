import { Form } from './../common/form';
import { IOrder } from '../../types';
import { IEvents } from '../base/events';

export class OrderForm extends Form<IOrder> {
  protected _buttonCard: HTMLButtonElement;
  protected _buttonCash: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    super(template, events);

    this._buttonCard = this._form.querySelector('button[name="card"]');
    this._buttonCash = this._form.querySelector('button[name="cash"]');

    // ✅ Значение по умолчанию — карта
    this.setPaymentMethod('card');

    this._buttonCard.addEventListener('click', () => {
      this.setPaymentMethod('card');
    });

    this._buttonCash.addEventListener('click', () => {
      this.setPaymentMethod('cash');
    });
  }

  /**
   * Устанавливает активный способ оплаты и переключает классы кнопок
   */
  setPaymentMethod(method: 'card' | 'cash') {
    if (method === 'card') {
      this._buttonCard.classList.add('button_alt');
      this._buttonCash.classList.remove('button_alt');
    } else {
      this._buttonCash.classList.add('button_alt');
      this._buttonCard.classList.remove('button_alt');
    }
    this.onInputChange('payment', method);
  }

  /**
   * Отключает оба варианта выбора оплаты
   */
  disableButtons() {
    this._buttonCard.classList.remove('button_alt');
    this._buttonCash.classList.remove('button_alt');
  }
}
