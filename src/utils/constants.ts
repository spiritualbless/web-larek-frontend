export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export const kinds = {
	'другое': '_other',
	'софт-скил': '_soft',
	'дополнительное': '_additional',
	'кнопка': '_button',
	'хард-скил': '_hard',
}

export const constraintsContacts = {
	phone: {
		presence: { message: '^Введите номер телефона.', allowEmpty: false },
		length: {
			minimum: 11,
			maximum: 18,
			tooShort: '^Номер телефона должен содержать 11 цифр.',
			tooLong: '^Номер телефона должен содержать 11 цифр.',

		},
		format: {
			pattern: /^(?:\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
			message: '^Номер телефона не может содержать букв.'
		}
	},

	email: {
		presence: { message: '^Введите адрес электронной почты.', allowEmpty: false },
		length: {
			minimum: 5,
			maximum: 100,
			tooShort: '^Адрес электронной почты должен содержать не менее 5 символов.',
			tooLong: '^Адрес электронной почты должен содержать не более 100 символов.',
		},
		format: {
			pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			message: '^Некоректный адрес электронной почты.',
		}
	}
}

export const constraintsOrder = {
	payment: {
		presence: { message: '^Выберите способ оплаты.', allowEmpty: false },
	},

	address: {
		presence: { message: '^Введите адрес доставки.', allowEmpty: false },
		length: {
			minimum: 10,
			maximum: 100,
			tooShort: '^Введите город, улицу и номер дома',
			tooLong: '^Адрес не может содержать больше 100 символов.',
		},
	}
}