/*
 * @Description:
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-08-02 07:30:31
 * @LastEditTime: 2020-08-02 07:40:40
 * @LastEditors: chtao
 * @FilePath: \wx-gzh\utils\index.ts
 */

import { request } from 'https';

export const post = (url: string, body: any) => {
  return new Promise((resolve, reject) => {
    body = JSON.stringify(body);
    const req = request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
        },
      },
      res => {
        let result = '';
        res.on('data', chunk => (result += chunk));

        res.on('end', () => {
          try {
            result = JSON.parse(result);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });

        res.on('error', e => reject(e));
      }
    );

    req.write(body);

    req.end();

    req.on('error', e => reject(e));
  });
};

export const get = (url: string) => {
  return new Promise((resolve, reject) => {
    const req = request(url, res => {
      let result = '';
      res.on('data', chunk => (result += chunk));

      res.on('end', () => {
        try {
          result = JSON.parse(result);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });

      res.on('error', e => reject(e));
    });

    req.end();

    req.on('error', e => reject(e));
  });
};
