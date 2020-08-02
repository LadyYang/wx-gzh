/*
 * @Description: 创建公众号菜单项
 * @Author: chtao
 * @Email: victoryct@163.com
 * @Github: https://github.com/LadyYang
 * @Date: 2020-05-27 13:11:26
 * @LastEditors: chtao
 * @LastEditTime: 2020-08-02 15:10:04
 * @FilePath: \wx-gzh\lib\menu.ts
 */

import https from 'https';
import WeChat from '..';

export async function createMenu(this: WeChat, data: object) {
  console.log('进入函数createMenu开始创建新菜单');

  const url =
    'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' +
    this.accessToken;

  const content = JSON.stringify(data);

  const obj = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(content),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, obj, res => {
      let result = '';
      res.setEncoding('utf8');

      res.on('data', chunk => {
        result += chunk;
      });

      res.on('end', () => {
        const { errcode, errmsg } = JSON.parse(result);

        if (errcode == 0) {
          resolve();
        } else {
          reject(JSON.parse(result));
        }
      });

      res.on('error', e => {
        reject(e);
      });
    });

    req.write(content);
    req.end();

    req.on('error', e => reject(e));
  });
}
