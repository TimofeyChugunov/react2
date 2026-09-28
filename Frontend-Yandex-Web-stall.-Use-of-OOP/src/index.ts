import './scss/styles.scss';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { DataApi } from './components/DataApi';
import { CartModel } from './components/CartModel';
import { OrderModel } from './components/OrderModel';
import { IEventData, IItem, IOrder } from './types';
import { ItemView } from './components/ItemView';
import { ModalView } from './components/ModalView';
import { CartView } from './components/CartView';
import { OrderFormView, ContactsFormView } from './components/FormView';
import { SuccessWindowView } from './components/SuccessWindowView';

// ТЕМПЛЕЙТЫ
const templateGalleryCard = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const contactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const windowSuccessTemplate = document.querySelector('#success') as HTMLTemplateElement;
const templateCartCard = document.querySelector('#card-basket') as HTMLTemplateElement;

// ЭКЗЕМПЛЯРЫ КЛАССОВ
const events = new EventEmitter();

const cartData = new CartModel(events);
const cartView = new CartView(cloneTemplate(cartTemplate), events);

// 🔥 ИСПРАВЛЕНО 1: OrderModel тоже должен участвовать в событиях, чтобы сообщать об изменениях
const orderData = new OrderModel(); 

const modalView = ModalView.getInstance(events);

const orderForm = new OrderFormView(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsFormView(cloneTemplate(contactsFormTemplate), events);
const successWindow = new SuccessWindowView(cloneTemplate(windowSuccessTemplate), events);

// ======================
// ЗАГРУЗКА И ОТРИСОВКА ТОВАРОВ
// ======================
const gallery = document.querySelector('.gallery') as HTMLElement | null;
let cards: ItemView[] = []; // 🔥 ИСПРАВЛЕНО 2: Вынесли объявление массива наверх, чтобы он был виден в обработчиках событий

if (!gallery) {
  console.error('❌ Не найден контейнер .gallery на странице');
} else {
  const api = new DataApi(API_URL);

  api
    .getItems()
    .then((data) => {
      cards = data.items.map((item: IItem) => {
        // Формируем правильный URL картинки
        const imagePath = item.image.startsWith('/') ? item.image : `/${item.image}`;
        item.image = `${CDN_URL.replace(/\/$/, '')}${imagePath}`;

        const card = new ItemView(cloneTemplate(templateGalleryCard), events, item);
        gallery.append(card.render());

        return card;
      });

      return cards;
    })
    .catch((err: unknown) => {
      console.error('❌ Ошибка загрузки товаров:', err);
    });

  // ======================
  // ПОДПИСКА НА СОБЫТИЯ
  // ======================

  events.on<IEventData>('modal:open', (item) => {
    modalView.openModal(item.element as HTMLElement);
  });

  // УДАЛИТЕ или закомментируйте эти строки:
  // events.on('modal:close', () => {
  //   modalView.closeModal();
  // });

  events.on<IEventData>('cart:remove', (item) => {
    cartData.remove(item.data);
  });

  events.on<IEventData>('cart:add', (item) => {
    cartData.add(item.data);
  });

  events.on<{ items: string[]; sum: number }>('cart:changed', (data) => {
    cartView.clear();
    const inCart = new Set(data.items);

    cards.forEach((card) => {
      const isInCart = inCart.has(card.data.id);
      
      // 🔥 ИСПРАВЛЕНО 3: Убираем `as any`. Мы добавим метод `setInCart` в класс ItemView (см. ниже)
      card.setInCart(isInCart); 

      if (isInCart) {
        cartView.addItem(
          card.getCartItemView(cloneTemplate(templateCartCard)),
          card.data.id,
          cartData.total
        );
      }
    });
  });

  events.on<string[]>('cart:submit', (itemIds) => { // Тип данных: просто массив ID
    orderData.setItems(itemIds); // Метод в OrderModel для установки товаров и total
    modalView.openModal(orderForm.render());
  });

  events.on<Partial<IOrder>>('orderData:changed', (data) => {
    orderData.setAddressAndPayment(data.address, data.payment);
    modalView.openModal(contactsForm.render());
  });

  events.on<Partial<IOrder>>('orderData:finished', (data) => {
    orderData.setContacts(data.phone, data.email);

    api
      .sendOrder(orderData.getFullOrderData()) // Метод, собирающий итоговый объект для отправки
      .then((result) => {
        modalView.openModal(successWindow.render(orderData.total));
        cartView.clear();
        cartData.clear();
        orderData.clear(); // Очищаем данные заказа после успешной покупки
      })
      .catch((err: unknown) => {
        console.error('Произошла ошибка при отправке заказа:', err);
        // Здесь можно открыть модалку с ошибкой, если предусмотрено ТЗ
      });
  });
}