/*
 * @Description: 微信各种支付
 * @Author: chtao
 * @Email: victoryct@163.com
 * @Github: https://github.com/LadyYang
 * @Date: 2020-06-18 23:24:38
 * @LastEditors: chtao
 * @LastEditTime: 2020-08-02 10:53:12
 * @FilePath: \wx-gzh\lib\pay.ts
 */

import crypto from 'crypto';

import { parseString } from 'xml2js';
import { promisify } from 'util';
import WeChat from '..';

import { post } from '../utils';

const ps = promisify(parseString);

function raw(args: { [P: string]: string | number }) {
  return Object.keys(args)
    .sort()
    .reduce((prev, key) => {
      prev += '&' + key + '=' + args[key];
      return prev;
    }, '')
    .substr(1);
}

// 签名
function sign(
  this: WeChat,
  options: {
    attach: string;
    body: string;
    nonce_str: string;
    openid: string;
    out_trade_no: string;
    total_fee: number;
    trade_type: string;
  }
) {
  const ret = {
    appid: this.appID,
    attach: options.attach,
    body: options.body,
    mch_id: this.payOptions!.mch_id,
    nonce_str: options.nonce_str,
    notify_url: this.payOptions!.notify_url,
    openid: options.openid,
    out_trade_no: options.out_trade_no,
    spbill_create_ip: this.payOptions!.client_ip,
    total_fee: options.total_fee,
    trade_type: options.trade_type,
  };

  const string = raw(ret) + '&key=' + this.payOptions!.key;

  return crypto
    .createHash('md5')
    .update(string, 'utf8')
    .digest('hex')
    .toUpperCase();
}

//签名加密算法,jsapi 第二次的签名
function signSecond(
  this: WeChat,
  options: {
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: string;
  }
) {
  const ret = {
    appId: this.appID,
    timeStamp: options.timeStamp,
    nonceStr: options.nonceStr,
    package: options.package,
    signType: options.signType,
  };
  const string = raw(ret) + '&key=' + this.payOptions!.key;
  return crypto
    .createHash('md5')
    .update(string, 'utf8')
    .digest('hex')
    .toUpperCase();
}

function createNonceStr() {
  return Math.random().toString(36).substr(2, 30);
}

function createTimeStamp() {
  return Math.floor(new Date().getTime() / 1000) + '';
}

function getBookingNo() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return '' + year + month + day + Math.random().toString(10).substr(2, 30);
}

async function order(
  this: WeChat,
  options: {
    attach: string;
    body: string;
    openid: string;
    total_fee: number;
    trade_type: string;
  }
) {
  const nonce_str = createNonceStr();
  const out_trade_no = getBookingNo();
  options.total_fee *= 100;
  const url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
  const formData = `<xml>
    <appid>${this.appID}</appid>
    <mch_id>${this.payOptions!.mch_id}</mch_id>
    <notify_url>${this.payOptions!.notify_url}</notify_url>
    <spbill_create_ip>${this.payOptions!.client_ip}</spbill_create_ip>
    <attach>${options.attach}</attach>
    <body>${options.body}</body>
    <nonce_str>${nonce_str}</nonce_str>
    <openid>${options.openid}</openid>
    <out_trade_no>${out_trade_no}</out_trade_no>
    <total_fee>${options.total_fee}</total_fee>
    <trade_type>${options.trade_type}</trade_type>
    <sign>${sign.call(this, {
      ...options,
      nonce_str,
      out_trade_no,
    })}</sign></xml>`;

  const result: any = await post(url, formData);
  console.log(result, 101001);
  return await ps(result);
}

export async function createJSAPIPayOrder(
  this: WeChat,
  options: {
    payType: string;
    num: string;
    price: number;
    openid: string;
    body?: string;
  }
) {
  const attach =
    options.num + 'wxpay' + options.payType + 'wxpay' + options.openid;

  return await order.call(this, {
    ...options,
    attach,
    body: options.payType,
    total_fee: options.price,
    trade_type: 'JSAPI',
  });
}

export async function createH5PayOrder(
  this: WeChat,
  options: {
    payType: string;
    num: string;
    price: number;
    openid: string;
    body?: string;
  }
) {
  const attach =
    options.num + 'wxpay' + options.payType + 'wxpay' + options.openid;

  const orderResult: any = await order.call(this, {
    ...options,
    attach,
    body: options.payType,
    total_fee: options.price,
    trade_type: 'JSAPI',
  });

  if (
    orderResult.xml.return_code[0] === 'SUCCESS' &&
    orderResult.xml.result_code[0] === 'SUCCESS'
  ) {
    const timeStamp = createTimeStamp();
    const nonceStr = orderResult.xml.nonce_str[0];
    const _package = 'prepay_id=' + orderResult.xml.prepay_id[0];
    const signType = 'MD5';
    const paySign = signSecond.call(this, {
      timeStamp,
      nonceStr,
      package: _package,
      signType,
    });

    return {
      appId: this.appID,
      timestamp: timeStamp,
      nonceStr: nonceStr,
      package: _package,
      signType: signType,
      paySign: paySign,
    };
  } else {
    return {
      appId: this.appID,
      timestamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
    };
  }
}
