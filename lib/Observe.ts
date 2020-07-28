/*
 * @Description: 观察者模式
 * @Author: chtao
 * @Email: 1763615252@qq.com
 * @Date: 2020-07-28 20:13:47
 * @LastEditTime: 2020-07-29 07:21:53
 * @LastEditors: chtao
 * @FilePath: \zwdownload\server\wechat\lib\Observe.ts
 */

import { WeChatEvent, BaseEvent } from '../types';

export default class Observe {
  private listeners = new Map();

  addListener(
    event: keyof WeChatEvent,
    listener: (e: BaseEvent) => Promise<string>
  ): this {
    const funsArr: Function[] = this.listeners.get(event);
    if (funsArr) {
      this.listeners.set(event, funsArr.push(listener));
    } else {
      this.listeners.set(event, [listener]);
    }

    return this;
  }

  on = this.addListener;

  removeListener(
    event: keyof WeChatEvent,
    listener: (e: BaseEvent) => void
  ): this {
    const funsArr: Function[] = this.listeners.get(event);

    if (funsArr) {
      const newArr = funsArr.filter(fun => fun !== listener);
      this.listeners.set(event, newArr);
    }

    return this;
  }

  off = this.removeListener;

  removeAllListeners(event?: keyof WeChatEvent): this {
    this.listeners.set(event, null);

    return this;
  }

  async emit(event: keyof WeChatEvent, e: BaseEvent) {
    const funsArr: Function[] = this.listeners.get(event);

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
