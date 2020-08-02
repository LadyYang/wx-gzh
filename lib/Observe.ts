/*
 * @Description: 观察者模式
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-08-02 00:05:35
 * @LastEditTime: 2020-08-02 08:29:07
 * @LastEditors: chtao
 * @FilePath: \wx-gzh\lib\Observe.ts
 */

import { WeChatEvent } from '../types';

export default class Observe {
  private listeners = new Map();

  addListener<T extends keyof WeChatEvent>(
    type: T,
    listener: WeChatEvent[T]
  ): this {
    const funsArr: Function[] = this.listeners.get(type);
    if (funsArr) {
      this.listeners.set(type, funsArr.push(listener));
    } else {
      this.listeners.set(type, [listener]);
    }

    return this;
  }

  on = this.addListener;

  removeListener<T extends keyof WeChatEvent>(
    type: T,
    listener: WeChatEvent[T]
  ): this {
    const funsArr: Function[] = this.listeners.get(type);

    if (funsArr) {
      const newArr = funsArr.filter(fun => fun !== listener);
      this.listeners.set(event, newArr);
    }

    return this;
  }

  off = this.removeListener;

  removeAllListeners(type: keyof WeChatEvent): this {
    this.listeners.set(type, null);

    return this;
  }

  async emit<T extends keyof WeChatEvent>(
    type: T,
    e: Parameters<WeChatEvent[T]>[0]
  ) {
    const funsArr: Function[] = this.listeners.get(type);

    if (funsArr) {
      const result = funsArr.map(async fun => await fun(e));
      return Promise.all(result);
    }

    return [];
  }

  listenerCount(type: keyof WeChatEvent): number {
    const funsArr: Function[] = this.listeners.get(type);

    if (funsArr) {
      return funsArr.length;
    }

    return 0;
  }
}
