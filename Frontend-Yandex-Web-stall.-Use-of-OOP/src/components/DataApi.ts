import { Api } from './base/api';
import { IDataApi, IItem, IOrder } from '../types';

export class DataApi extends Api implements IDataApi {

  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  getItems(): Promise<{items: IItem[]}> {
    return this.get('/product') as Promise<{items: IItem[]}>;
  }

  getItem(id: string): Promise<IItem> {
    return this.get(`/product/${id}`) as Promise<IItem>;
  }

  sendOrder(data: IOrder): Promise<object> {
    return this.post('/order', data) as Promise<object>;
  }
}
