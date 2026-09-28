import { View } from '../components/base/view';
import { IEventEmitter } from '../types';

export class SuccessWindowView extends View {
  protected finishButton: HTMLButtonElement;
  protected sum: HTMLSpanElement;

  constructor(element: HTMLElement, events: IEventEmitter) {
    super(element, events);

    this.finishButton = this.element.querySelector('.order-success__close') as HTMLButtonElement;
    this.sum = this.element.querySelector('.order-success__sum') as HTMLSpanElement;
    
    this.finishButton.addEventListener(('click'), (event) => {
      this.events.emit('modal:close');
    });

  }

  render(sum: number) {
    this.sum.textContent = sum + "";

    return super.render();
  }
}