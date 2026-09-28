import { IEventEmitter, IView } from "../../types";

export abstract class View implements IView {
  protected element: HTMLElement;
  protected events: IEventEmitter;

  constructor(element: HTMLElement, events: IEventEmitter) {
    this.element = element;
    this.events = events; // Теперь events обязательный
  }

  toggleClass(element: HTMLElement, className: string) {
    if(element.classList.contains(className)) {
      element.classList.remove(className);
    } else {
      element.classList.add(className);
    }
  }

  render(data?: unknown): HTMLElement {
    return this.element;
  }
}