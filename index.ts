/*
 * @Description:
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-07-26 20:45:01
 * @LastEditTime: 2020-08-01 23:37:45
 * @LastEditors: chtao
 * @FilePath: \wx-gzh\index.ts
 */

import crypto from 'crypto';

import { responseText, responsePay } from './lib/response';
import { createMenu } from './lib/menu';
import { getQRCode } from './lib/code';
import Observe from './lib/Observe';
import { createH5PayOrder, createJSAPIPayOrder } from './lib/pay';
import { PaySuccessEvent } from './types';

export default class WeChat extends Observe {
  public readonly appID: string;

  public readonly appsecret: string;

  private _token!: string;

  private path: string;

  /** 商户账号参数 */
  public payOptions?: {
    /** 微信支付商户号 */
    mch_id: string;

    /** 通知地址 */
    notify_url: string;

    client_ip: string;

    /** API密钥 */
    key: string;
  };

  /** 微信网页开发时需要的 ticket */
  public ticket?: string;

  constructor(
    options: {
      appID: string;
      appsecret: string;
      menuData: object;
      routePath: string;
      payOptions?: {
        /** 微信支付商户号 */
        mch_id: string;

        /** 通知地址 */
        notify_url: string;

        client_ip: string;

        /** API密钥 */
        key: string;
      };
    },
    web: boolean = false
  ) {
    super();
    this.appID = options.appID;
    this.appsecret = options.appsecret;
    this.path = options.routePath;
    this.payOptions = options.payOptions;

    // 获取 token
    this.getWechatAccessToken();

    web && this.getWeChatTicket();

    this.on('ready', async () => {
      createMenu.call(this, options.menuData);

      return '';
    });
  }

  get token() {
    return this._token;
  }

  set token(val: string) {
    this._token = val;

    this.emit('ready', {
      ToUserName: '',
      FromUserName: ',',
      MsgType: '',
      CreateTime: 1,
    });
  }

  /** 开启 web 开发，用户获取 ticket */
  public async openWeb() {
    await this.getWeChatTicket();
  }

  /** 验证微信接口 */
  public async auth(this: WeChat, ctx: any) {
    try {
      const { signature, timestamp, nonce, echostr } = ctx.request.query;
      const authStr = [this.token, timestamp, nonce].sort().join('');
      const hashStr = crypto
        .createHash('sha1')
        .update(authStr, 'utf8')
        .digest('hex');

      if (hashStr === signature) {
        ctx.body = echostr;
      } else {
        ctx.body = {
          message: '微信回调认证失败',
        };
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * 获取 access_token
   */
  private async getWechatAccessToken() {
    try {
      const result = await (
        await fetch(
          `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appID}&secret=${this.appsecret}`
        )
      ).json();

      this.token = result.access_token;

      setTimeout(
        this.getWechatAccessToken.bind(this),
        (result.expires_in - 1200) * 1000
      );
    } catch (err) {
      console.log(err);
    }
  }

  private async getWeChatTicket() {
    try {
      const result = await (
        await fetch(
          `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${this.token}&type=jsapi`
        )
      ).json();

      this.ticket = result.ticket;

      setTimeout(
        this.getWeChatTicket.bind(this),
        (result.expires_in - 1200) * 1000
      );
    } catch (err) {
      console.log(err);
    }
  }

  private async dealGZHEvent(ctx: any) {
    const { xml } = ctx.request.body;

    for (let key in xml) {
      xml[key] = xml[key][0];
    }

    let contents: any[];

    switch (xml.MsgType) {
      case 'text':
        contents = await this.emit('text', xml);
        return responseText(xml, contents.join(''), ctx);
    }

    switch (xml.Event) {
      case 'SCAN':
        contents = await this.emit('scan', xml);
        return responseText(xml, contents.join(''), ctx);
      case 'subscribe':
        contents = await this.emit('subscribe', xml);
        return responseText(xml, contents.join(''), ctx);
      case 'unsubscribe':
        contents = await this.emit('unsubscribe', xml);
        return responseText(xml, contents.join(''), ctx);
      case 'CLICK':
        contents = await this.emit('click', xml);
        return responseText(xml, contents.join(''), ctx);
      default:
        contents = await this.emit('unknow', xml);
        return responseText(xml, contents.join(''), ctx);
    }
  }

  private async dealPayEvent(ctx: any) {
    const { xml }: { xml: PaySuccessEvent } = ctx.request.body;

    if (xml.return_code === 'SUCCESS') {
      await this.emit('paySuccess', xml);
      responsePay(ctx);
    }

    if (xml.return_code === 'FAIL') {
      await this.emit('payFail', xml);
      responsePay(ctx);
    }
  }

  async _useMiddleware(ctx: any, next: any) {
    if (ctx.originalUrl.includes(this.path)) {
      return await this.dealGZHEvent(ctx);
    }

    if (ctx.originalUrl.includes(this.payOptions?.notify_url)) {
      return await this.dealPayEvent(ctx);
    }

    await next();
  }

  useMiddleware = this._useMiddleware.bind(this);

  getQRCode = getQRCode;

  createH5PayOrder = createH5PayOrder;

  createJSAPIPayOrder = createJSAPIPayOrder;
}
