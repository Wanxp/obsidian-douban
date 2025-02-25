/**
 * 日期选择组件
 * 继承自 TextComponent
 */

import {TextComponent} from 'obsidian';

export class DatePickComponent extends TextComponent {
  constructor(container: HTMLElement, date: Date = new Date()) {
    super(container);
    this.inputEl.type = 'date';
    this.inputEl.value = date.toISOString().substring(0, 10);
  }

  getValue(): string {
    return this.inputEl.value;
  }
}
