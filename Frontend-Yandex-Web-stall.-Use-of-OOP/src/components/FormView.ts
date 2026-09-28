import { IEventEmitter, PaymentType } from "../types";
import { View } from "./base/view";

abstract class BaseFormView extends View {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement | null;
  protected errorElement: HTMLElement | null;

  constructor(element: HTMLElement, events: IEventEmitter) {
    super(element, events);
    
    this.formElement = this.element.querySelector('form') || (this.element as HTMLFormElement);
    this.submitButton = this.element.querySelector('button[type="submit"]') as HTMLButtonElement 
                 || this.element.querySelector('.submit-button') as HTMLButtonElement;
    this.errorElement = this.element.querySelector('.form__error') || this.element.querySelector('.form__errors');
    
    console.log('--- BaseFormView ---');
    console.log('Форма найдена:', !!this.formElement);
    console.log('Кнопка отправки (.button) найдена:', !!this.submitButton);
    console.log('Блок ошибок найден:', !!this.errorElement);
    
    if (this.submitButton) {
      this.submitButton.disabled = true;
    }
    
    this.formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('>>> СРАБОТАЛ SUBMIT ФОРМЫ (клик по кнопке)');
      this.handleSubmit();
    });
  }

  protected abstract validate(): boolean;
  protected abstract getFormData(): Record<string, unknown>;

  protected handleSubmit() {
    if (this.validate()) {
      const data = this.getFormData();
      console.log('>>> Валидация успешна! Данные:', data);
      
      if ('payment' in data && 'address' in data) {
        console.log('>>> Отправка события orderData:changed');
        this.events.emit('orderData:changed', data);
      } else if ('email' in data && 'phone' in data) {
        console.log('>>> Отправка события orderData:finished');
        this.events.emit('orderData:finished', data);
      }
    } else {
      console.log('>>> Валидация провалена. Кнопка не нажмется.');
    }
  }

  protected showError(message: string) {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.classList.remove('invisible');
    }
  }

  protected hideError() {
    if (this.errorElement) {
      this.errorElement.textContent = '';
      this.errorElement.classList.add('invisible');
    }
  }

  protected setButtonState(enabled: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !enabled;
      console.log('-> Состояние кнопки "Далее/Оплатить":', enabled ? 'АКТИВНА' : 'ЗАБЛОКИРОВАНА');
    }
  }

  protected isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }
}

export class OrderFormView extends BaseFormView {
  protected paymentCashButton: HTMLButtonElement | null;
  protected paymentCardButton: HTMLButtonElement | null;
  protected addressInput: HTMLInputElement | null;
  protected payment: PaymentType | null = null;

  constructor(element: HTMLElement, events: IEventEmitter) {
    super(element, events);

    // 🔥 ИСПРАВЛЕНО: Ищем по ID, так как name может отсутствовать в шаблоне
    this.paymentCardButton = this.element.querySelector('#buttonCard') as HTMLButtonElement;
    this.paymentCashButton = this.element.querySelector('#buttonCash') as HTMLButtonElement;
    this.addressInput = this.element.querySelector('input[name="address"]') as HTMLInputElement;

    console.log('--- OrderFormView ---');
    console.log('Кнопка "Картой" (#buttonCard) найдена:', !!this.paymentCardButton);
    console.log('Кнопка "Наличные" (#buttonCash) найдена:', !!this.paymentCashButton);
    console.log('Поле "Адрес" (name="address") найдено:', !!this.addressInput);

    if (this.addressInput) {
      this.addressInput.addEventListener('input', () => this.validate());
    }

    if (this.paymentCashButton) {
      this.paymentCashButton.addEventListener('click', () => {
        console.log('Клик по "Наличные"');
        this.paymentCardButton?.classList.remove('button_alt-active');
        this.paymentCashButton?.classList.add('button_alt-active');
        this.payment = PaymentType.Cash;
        this.validate();
      });
    } else {
      console.warn('⚠️ Кнопка "Наличные" не найдена! Проверьте HTML.');
    }

    if (this.paymentCardButton) {
      this.paymentCardButton.addEventListener('click', () => {
        console.log('Клик по "Картой"');
        this.paymentCashButton?.classList.remove('button_alt-active');
        this.paymentCardButton?.classList.add('button_alt-active');
        this.payment = PaymentType.Online;
        this.validate();
      });
    } else {
      console.warn('⚠️ Кнопка "Картой" не найдена! Проверьте HTML.');
    }

    this.validate();
  }


  protected validate(): boolean {
    const isPaymentSelected = !!this.payment;
    const isAddressFilled = this.addressInput ? this.isNotEmpty(this.addressInput.value) : false;
    
    console.log(`-> Проверка: Оплата выбрана? ${isPaymentSelected} (текущая: ${this.payment}) | Адрес введен? ${isAddressFilled} (текст: "${this.addressInput?.value}")`);
    
    const isValid = isPaymentSelected && isAddressFilled;
    this.setButtonState(isValid);
    
    if (!isValid) {
      if (!isPaymentSelected) {
        this.showError('Выберите способ оплаты');
      } else if (!isAddressFilled) {
        this.showError('Введите адрес доставки');
      }
      return false;
    } else {
      this.hideError();
      return true;
    }
  }

  protected getFormData(): Record<string, unknown> {
    return {
      payment: this.payment,
      address: this.addressInput?.value.trim() || '',
    };
  }
}

export class ContactsFormView extends BaseFormView {
  protected emailInput: HTMLInputElement | null;
  protected phoneInput: HTMLInputElement | null;

  constructor(element: HTMLElement, events: IEventEmitter) {
    super(element, events);
    
    this.emailInput = this.element.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = this.element.querySelector('input[name="phone"]') as HTMLInputElement;

    console.log('--- ContactsFormView ---');
    console.log('Поле "Email" (name="email") найдено:', !!this.emailInput);
    console.log('Поле "Телефон" (name="phone") найдено:', !!this.phoneInput);

    if (this.emailInput) {
      this.emailInput.addEventListener('input', () => this.validate());
    }
    
    if (this.phoneInput) {
      this.phoneInput.addEventListener('input', () => this.validate());
    }

    this.validate();
  }

  protected validate(): boolean {
    const isEmailFilled = this.emailInput ? this.isNotEmpty(this.emailInput.value) : false;
    const isPhoneFilled = this.phoneInput ? this.isNotEmpty(this.phoneInput.value) : false;
    
    console.log(`-> Проверка: Email введен? ${isEmailFilled} | Телефон введен? ${isPhoneFilled}`);
    
    const isValid = isEmailFilled && isPhoneFilled;
    this.setButtonState(isValid);
    
    if (!isValid) {
      if (!isEmailFilled && !isPhoneFilled) {
        this.showError('Введите email и телефон');
      } else if (!isEmailFilled) {
        this.showError('Введите email');
      } else {
        this.showError('Введите телефон');
      }
      return false;
    } else {
      this.hideError();
      return true;
    }
  }

  protected getFormData(): Record<string, unknown> {
    return {
      email: this.emailInput?.value.trim() || '',
      phone: this.phoneInput?.value.trim() || '',
    };
  }
}