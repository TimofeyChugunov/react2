import { IOrder, IOrderModel, PaymentType } from "../types";

export class OrderModel implements IOrderModel {
  protected _payment: PaymentType | null = null;
  protected _address: string = '';
  protected _email: string = '';
  protected _phone: string = '';
  protected _items: string[] = [];
  protected _total: number = 0;
  protected _customerFullInfo: IOrder;

  constructor() {
    this._customerFullInfo = {
      payment: PaymentType.Cash,
      address: this._address,
      email: this._email,
      phone: this._phone,
      items: this._items,
      total: this._total,
    };
  }

  set payment(paymentType: PaymentType | null) {
    this._payment = paymentType;
    if (this._customerFullInfo) this._customerFullInfo.payment = paymentType || PaymentType.Cash;
  }

  get payment(): PaymentType | null {
    return this._payment;
  }

  set address(address: string) {
    this._address = address;
    if (this._customerFullInfo) this._customerFullInfo.address = address;
  }

  get address(): string {
    return this._address;
  }

  set email(email: string) {
    this._email = email;
    if (this._customerFullInfo) this._customerFullInfo.email = email;
  }

  get email(): string {
    return this._email;
  }

  set phone(phone: string) {
    this._phone = phone;
    if (this._customerFullInfo) this._customerFullInfo.phone = phone;
  }

  get phone(): string {
    return this._phone;
  }

  set items(items: string[]) {
    this._items = items;
    if (this._customerFullInfo) this._customerFullInfo.items = items;
  }

  get items() {
    return this._items;
  }

  set total(total: number) {
    this._total = total;
    if (this._customerFullInfo) this._customerFullInfo.total = total;
  }

  get total() {
    return this._total;
  }

  get customerFullInfo(): IOrder {
    return this._customerFullInfo;
  }

  // Методы для установки данных (БЕЗ генерации событий!)
  setItems(itemIds: string[]) {
    this.items = itemIds;
  }

  setAddressAndPayment(address: string, payment: PaymentType | null) {
    this.address = address || '';
    this.payment = payment;
    // Никаких this.events.emit здесь быть не должно!
  }

  setContacts(phone: string, email: string) {
    this.phone = phone || '';
    this.email = email || '';
    // Никаких this.events.emit здесь быть не должно!
  }

  getFullOrderData(): IOrder {
    return this._customerFullInfo;
  }

  clear() {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
    this._items = [];
    this._total = 0;
    this._customerFullInfo = {
      payment: PaymentType.Cash,
      address: '',
      email: '',
      phone: '',
      items: [],
      total: 0,
    };
  }
}