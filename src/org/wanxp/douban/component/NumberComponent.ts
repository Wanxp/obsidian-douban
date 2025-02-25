/**
 * 日期选择组件
 * 继承自 TextComponent
 */

import {TextComponent} from 'obsidian';

export class NumberComponent extends TextComponent {
  constructor(container: HTMLElement, value: number = 0) {
    super(container);
    this.inputEl.type = 'date';
    this.inputEl.value = value.toString();
  }

  getValue(): string {
    return this.inputEl.value;
  }

  //当输入框输入的内容不是数字时，则回退到之前的值
  // onChanged() {
  //   if (isNaN(Number(this.inputEl.value))) {
  //     this.inputEl.value = this.inputEl.value.slice(0, -1);
  //   }
  // }

}
