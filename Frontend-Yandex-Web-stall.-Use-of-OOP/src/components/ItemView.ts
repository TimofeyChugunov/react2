import { IEventEmitter, IItem, IItemView } from "../types";
import { cloneTemplate } from "../utils/utils";
import { View } from "./base/view";

const templateFullViewCard = document.querySelector('#card-preview') as HTMLTemplateElement;

export class ItemView extends View implements IItemView {
  protected category: HTMLSpanElement | null;
  protected title: HTMLHeadingElement | HTMLSpanElement | null;
  protected image: HTMLImageElement | null;
  protected price: HTMLSpanElement | null;
  protected description: HTMLParagraphElement | null;
  protected _data: Partial<IItem>;
  protected isInCart: boolean = false;

  constructor(element: HTMLElement, events: IEventEmitter, data: Partial<IItem>) {
    super(element, events);
    this._data = data;
    this.initiateHtmlElement(this.element);

    // Раскраска категорий
    if (this.category && this.data.category) {
      this.category.textContent = this.data.category;
      switch(this.data.category) {
        case "софт-скил": this.category.classList.add('card__category_soft'); break;
        case "другое": this.category.classList.add('card__category_other'); break;
        case "дополнительное": this.category.classList.add('card__category_additional'); break;
        case "кнопка": this.category.classList.add('card__category_button'); break;
        case "хард-скил": this.category.classList.add('card__category_hard'); break;
      }
    }

    // Клик по карточке в галерее открывает модалку
    if (this.element.classList.contains('gallery__item')) {
      this.element.addEventListener('click', () => {
        this.events.emit('modal:open', { 
          element: this.getModalItemView(cloneTemplate(templateFullViewCard)), 
          data: this.data 
        });
      });
    }
  }

  get data() {
    return this._data;
  }

  // 🔥 ИСПРАВЛЕНО: Универсальный метод обновления состояния кнопки
  public setInCart(isInCart: boolean): void {
    this.isInCart = isInCart;
    const btn = this.element.querySelector('.card__button') as HTMLButtonElement | null;
    if (!btn) return;

    if (this.data.price === null) {
      btn.disabled = true;
      btn.textContent = 'Нельзя купить';
    } else if (isInCart) {
      btn.disabled = true;
      btn.textContent = 'В корзине';
    } else {
      btn.disabled = false;
      btn.textContent = 'Купить';
    }
  }

  getCartItemView(element: HTMLElement): HTMLElement {
    this.initiateHtmlElement(element);
    
    // 🔥 ИСПРАВЛЕНО: Вешаем обработчик на конкретную кнопку в новом клоне, 
    // но делаем это аккуратно, чтобы не плодить слушатели.
    const removeBtn = this.element.querySelector('.basket__item-delete') as HTMLButtonElement;
    if (removeBtn) {
      // Удаляем старые слушатели, если вдруг метод вызван повторно (защита)
      const newRemoveBtn = removeBtn.cloneNode(true) as HTMLButtonElement;
      removeBtn.parentNode?.replaceChild(newRemoveBtn, removeBtn);
      
      newRemoveBtn.addEventListener('click', () => {
        this.events.emit('cart:remove', { data: this.data });
      });
    }
    
    return this.render();
  }

  getModalItemView(element: HTMLElement): HTMLElement {
    this.initiateHtmlElement(element);
    
    const addBtn = this.element.querySelector('.card__button') as HTMLButtonElement;
    if (addBtn) {
      // Аналогичная защита от дублирования слушателей
      const newAddBtn = addBtn.cloneNode(true) as HTMLButtonElement;
      addBtn.parentNode?.replaceChild(newAddBtn, addBtn);
      
      newAddBtn.addEventListener('click', () => {
        this.events.emit('cart:add', { data: this.data });
        this.setInCart(true); // Используем наш новый надежный метод
      });
    }
    
    return this.render();
  }

  protected initiateHtmlElement(element: HTMLElement) {
    this.element = element;
    this.category = this.element.querySelector('.card__category');
    this.title = this.element.querySelector('.card__title');
    this.image = this.element.querySelector('.card__image');
    this.price = this.element.querySelector('.card__price');
    this.description = this.element.querySelector('.card__text');
  }

  render() {
    if (this.data) {
      if (this.title && this.data.title) this.title.textContent = this.data.title;
      if (this.image && this.data.image) this.image.src = this.data.image;
      
      // 🔥 ИСПРАВЛЕНО: Логика цены и "бесценности"
      if (this.price) {
        if (this.data.price === null) {
          this.price.textContent = "бесценно";
        } else {
          this.price.textContent = `${this.data.price} синапсов`;
        }
      }
      
      if (this.description && this.data.description) {
        this.description.textContent = this.data.description;
      }
    }

    // Применяем состояние кнопки в самом конце, когда все элементы уже найдены
    this.setInCart(this.isInCart);

    return super.render();
  }
}