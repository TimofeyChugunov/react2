import { ICartModel, IEventEmitter, IItem } from "../types";

export class CartModel implements ICartModel {
  // 🔥 ИСПРАВЛЕНО: Для задачи "без дублей" проще и надежнее использовать Set или просто Map с значением 1.
  // Оставим Map для совместимости с твоим кодом, но упростим логику.
  protected _items: Map<string, number> = new Map();
  protected _total: number = 0;

  constructor(protected events: IEventEmitter) {}

  add(data: Partial<IItem>): void {
    // 🔥 ИСПРАВЛЕНО: Защита от добавления бесценного товара и дублей
    if (data.price === null || data.price === undefined) return;
    if (!data.id) return;

    if (!this._items.has(data.id)) {
      this._items.set(data.id, 1); // Всегда 1, так как дубли запрещены
      this._total += Number(data.price);
      this._changed();
    }
  }

  remove(data: Partial<IItem>): void {    
    if (!data.id || !this._items.has(data.id)) return;
    
    // Просто удаляем товар и вычитаем цену
    this._total -= Number(data.price);
    this._items.delete(data.id);
    this._changed();
  }

  get items() {
    return this._items;
  }

  has(id: string): boolean {
    return this._items.has(id);
  }

  get total() {
    return this._total;
  }

  clear(): void {
    this._items.clear();
    this._total = 0;
    this._changed();
  }

  protected _changed() {
    this.events.emit('cart:changed', { 
      items: Array.from(this._items.keys()), 
      sum: this._total 
    });
  }
}