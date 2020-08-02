/*
 * @Description: 微信网页版 sdk 开发
 * @Author: chtao
 * @Email: victoryct@163.com
 * @Github: https://github.com/LadyYang
 * @Date: 2020-06-05 15:58:35
 * @LastEditors: chtao
 * @LastEditTime: 2020-08-02 09:07:01
 * @FilePath: \wx-gzh\lib\sdk.ts
 */

import crypto from 'crypto';
import WeChat from '..';

function sha1(str: string) {
  return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
}

/**
 * 生成签名的时间戳
 */
function createTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * 生成签名的随机串
 */
function createNonceStr() {
  return Math.random().toString(36).substr(2, 15);
}

/**
 * 对参数对象进行字典排序
 */
function raw(args: any) {
  const keys = Object.keys(args).sort();
  const newArgs: any = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  let string = '';
  for (const k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}

/**
 * JS-SDK使用权限签名算法 获取 signature
 */
export default function getSignature(this: WeChat, href: string) {
  var ret: any = {
    jsapi_ticket: this.ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: href,
  };

  ret.signature = sha1(raw(ret));
  ret.appId = this.appID;

  return ret;
}
