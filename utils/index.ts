/*
 * @Description:
 * @Author: chtao
 * @Github: https://github.com/LadyYang
 * @Email: 1763615252@qq.com
 * @Date: 2020-08-02 07:30:31
 * @LastEditTime: 2020-08-03 14:05:32
 * @LastEditors: chtao
 * @FilePath: \zwdownloadd:\Projects\wx-gzh\utils\index.ts
 */

import { request } from 'https';

export const post = (url: string, body: any, responseJSON = true): any => {
  let headers = {};

  if (typeof body === 'object') {
    body = JSON.stringify(body);
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    };
  }

  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: 'POST',
        headers,
      },
      res => {
        let result = '';
        res.on('data', chunk => (result += chunk));

        res.on('end', () => {
          try {
            if (responseJSON) result = JSON.parse(result);
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

export const get = (url: string, responseJSON = true): any => {
  return new Promise((resolve, reject) => {
    const req = request(url, res => {
      let result = '';
      res.on('data', chunk => (result += chunk));

      res.on('end', () => {
        try {
          if (responseJSON) result = JSON.parse(result);
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
