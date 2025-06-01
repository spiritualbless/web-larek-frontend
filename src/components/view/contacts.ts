import { Form } from '../form';
import { IContactsForm } from '../../types';
import { IEvents } from '../base/events';

export class ContactsForm extends Form<IContactsForm> {
	constructor(template: HTMLTemplateElement, events: IEvents) {
		super(template, events);
	}
}
